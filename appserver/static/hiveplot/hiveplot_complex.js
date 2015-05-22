// Hive plot D3.js code taken and modified from http://bost.ocks.org/mike/hive/ by Mike Bostock

define(function(require, exports, module) {
    var _ = require("underscore");
    var d3 = require("../d3/d3");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    require("css!./hiveplot_complex.css");

    var HivePlot = SimpleSplunkView.extend({
        className: "splunk-toolkit-hive-plot",
        options: {
            "managerid": null,
            "data": "preview",
            "height": 900,
            "src_field": "src",
            "dest_field": "dest",
            "category_field": "category"
        },
        output_mode: "json",
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
            // In the case that any options are changed, it will dynamically update without having to refresh
            // Copy the following line for whichever field you'd like dynamic updating on
        },
        createView: function() {
            // Without this css, the chordchart won't be centered
            this.$el.css({
                "width": this.settings.get("height")+"px",
                "margin": "0 auto"
            });

            return true;
        },
        // Making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            var that = this;

            var src_field = that.settings.get("src_field");
            var dest_field = that.settings.get("dest_field");
            var category_field = that.settings.get("category_field");

            var formatted_data = _(data)
                .chain()
                .groupBy(src_field)
                .map(function(v, k) {
                    var obj = {
                        src: k,
                        category: v[0][category_field],
                        dests: _(v).pluck(dest_field)
                    };

                    if(obj.dests[0] === undefined) {
                        obj.dests = [];
                    }

                    return obj;
                })
                .value();

            return formatted_data; // this is passed into updateView as 'data'
        },
        updateView: function(viz, data) {
            var that = this;

            // clearing all prior junk from the view (eg. 'waiting for data...')
            that.$el.html("");

            var width = that.$el.width(), //960,
                height = 900, //850,
                innerRadius = 40,
                outerRadius = 640,
                majorAngle = 2 * Math.PI / 3,
                minorAngle = 1 * Math.PI / 12;

            var angle = d3.scale.ordinal()
                .domain(["source", "source-target", "target-source", "target"])
                .range([0, majorAngle - minorAngle, majorAngle + minorAngle, 2 * majorAngle]);

            var radius = d3.scale.linear()
                .range([innerRadius, outerRadius]);

            var color = d3.scale.category10();

            var svg = d3.select(that.el).append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + outerRadius * .40 + "," + outerRadius * .57 + ")");

            // Load the data and display the plot!
            var nodes = data;

            var nodesByName = {},
                links = [],
                formatNumber = d3.format(",d"),
                defaultInfo;

            // Construct an index by node name.
            nodes.forEach(function(d) {
                d.connectors = [];
                nodesByName[d.src] = d;
            });

            // Convert the import lists into links with sources and targets.
            nodes.forEach(function(source) {
                source.dests.forEach(function(targetName) {
                    var target = nodesByName[targetName];
                    if (!source.source) source.connectors.push(source.source = {node: source, degree: 0});
                    if (!target.target) target.connectors.push(target.target = {node: target, degree: 0});
                    links.push({source: source.source, target: target.target});
                });
            });

            // Determine the type of each node, based on incoming and outgoing links.
            nodes.forEach(function(node) {
                if(node.source && node.target) {
                    node.type = node.source.type = "target-source";
                    node.target.type = "source-target";
                }
                else if(node.source) {
                    node.type = node.source.type = "source";
                }
                else if(node.target) {
                    node.type = node.target.type = "target";
                }
                else {
                    node.connectors = [{node: node}];
                    node.type = "source";
                }
            });

            // Initialize the info display.
            var info = d3.select("#info")
                .text(defaultInfo = "Showing " + formatNumber(links.length) + " dependencies among " + formatNumber(nodes.length) + " classes.");

            // Normally, Hive Plots sort nodes by degree along each axis. However, since
            // this example visualizes a package hierarchy, we get more interesting
            // results if we group nodes by package. We don't need to sort explicitly
            // because the data file is already sorted by class name.

            // Nest nodes by type, for computing the rank.
            var nodesByType = d3.nest()
                .key(function(d) { return d.type; })
                .sortKeys(d3.ascending)
                .entries(nodes);

            // Duplicate the target-source axis as source-target.
            nodesByType.push({key: "source-target", values: nodesByType[2].values});

            // Compute the rank for each type, with padding between packages.
            nodesByType.forEach(function(type) {
                var lastName = type.values[0].category, count = 0;
                type.values.forEach(function(d, i) {
                if (d.category != lastName) lastName = d.category, count += 2;
                d.index = count++;
                });
                type.count = count - 1;
            });

            // Set the radius domain.
            radius.domain(d3.extent(nodes, function(d) { return d.index; }));

            // Draw the axes.
            svg.selectAll(".axis")
                .data(nodesByType)
                .enter().append("line")
                .attr("class", "axis")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d.key)) + ")"; })
                .attr("x1", radius(-2))
                .attr("x2", function(d) { return radius(d.count + 2); });

            // Draw the links.
            svg.append("g")
                .attr("class", "links")
                .selectAll(".link")
                .data(links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", link()
                .angle(function(d) { return angle(d.type); })
                .radius(function(d) { return radius(d.node.index); }))
                .on("mouseover", linkMouseover)
                .on("mouseout", mouseout);

            // Draw the nodes. Note that each node can have up to two connectors,
            // representing the source (outgoing) and target (incoming) links.
            svg.append("g")
                .attr("class", "nodes")
                .selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class", "node")
                .style("fill", function(d) { return color(d.category); })
                .selectAll("circle")
                .data(function(d) { return d.connectors; })
                .enter().append("circle")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d.type)) + ")"; })
                .attr("cx", function(d) { return radius(d.node.index); })
                .attr("r", 4)
                .on("mouseover", nodeMouseover)
                .on("mouseout", mouseout)
                .on("click", nodeClick);

            function nodeClick(d) {
                var e = {
                    "src": d.node.src,
                    "dests": d.node.dests,
                    "category": d.node.category
                };
                trigger("click", e);
            }

            // Highlight the link and connected nodes on mouseover.
            function linkMouseover(d) {
                svg.selectAll(".link").classed("active", function(p) { return p === d; });
                svg.selectAll(".node circle").classed("active", function(p) { return p === d.source || p === d.target; });
                info.text(d.source.node.src + " → " + d.target.node.src);
            }

            // Highlight the node and connected links on mouseover.
            function nodeMouseover(d) {
                svg.selectAll(".link").classed("active", function(p) { return p.source === d || p.target === d; });
                svg.selectAll(".node circle").classed("active", function(p) { return p === d.source || p === d.target; });
                d3.select(this).classed("active", true);
                info.text(d.node.src);
            }

            // Clear any highlighted nodes or links.
            function mouseout() {
                svg.selectAll(".active").classed("active", false);
                info.text(defaultInfo);
            }

            // A shape generator for Hive links, based on a source and a target.
            // The source and target are defined in polar coordinates (angle and radius).
            // Ratio links can also be drawn by using a startRadius and endRadius.
            // This class is modeled after d3.svg.chord.
            function link() {
            var source = function(d) { return d.source; },
                target = function(d) { return d.target; },
                angle = function(d) { return d.angle; },
                startRadius = function(d) { return d.radius; },
                endRadius = startRadius,
                arcOffset = -Math.PI / 2;

            function link(d, i) {
                var s = node(source, this, d, i),
                    t = node(target, this, d, i),
                    x;
                if (t.a < s.a) x = t, t = s, s = x;
                if (t.a - s.a > Math.PI) s.a += 2 * Math.PI;
                var a1 = s.a + (t.a - s.a) / 3,
                    a2 = t.a - (t.a - s.a) / 3;
                return s.r0 - s.r1 || t.r0 - t.r1
                    ? "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
                    + "L" + Math.cos(s.a) * s.r1 + "," + Math.sin(s.a) * s.r1
                    + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
                    + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
                    + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1
                    + "L" + Math.cos(t.a) * t.r0 + "," + Math.sin(t.a) * t.r0
                    + "C" + Math.cos(a2) * t.r0 + "," + Math.sin(a2) * t.r0
                    + " " + Math.cos(a1) * s.r0 + "," + Math.sin(a1) * s.r0
                    + " " + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
                    : "M" + Math.cos(s.a) * s.r0 + "," + Math.sin(s.a) * s.r0
                    + "C" + Math.cos(a1) * s.r1 + "," + Math.sin(a1) * s.r1
                    + " " + Math.cos(a2) * t.r1 + "," + Math.sin(a2) * t.r1
                    + " " + Math.cos(t.a) * t.r1 + "," + Math.sin(t.a) * t.r1;
            }

            function node(method, thiz, d, i) {
                var node = method.call(thiz, d, i),
                    a = +(typeof angle === "function" ? angle.call(thiz, node, i) : angle) + arcOffset,
                    r0 = +(typeof startRadius === "function" ? startRadius.call(thiz, node, i) : startRadius),
                    r1 = (startRadius === endRadius ? r0 : +(typeof endRadius === "function" ? endRadius.call(thiz, node, i) : endRadius));
                return {r0: r0, r1: r1, a: a};
            }

            link.source = function(_) {
                if (!arguments.length) return source;
                source = _;
                return link;
            };

            link.target = function(_) {
                if (!arguments.length) return target;
                target = _;
                return link;
            };

            link.angle = function(_) {
                if (!arguments.length) return angle;
                angle = _;
                return link;
            };

            link.radius = function(_) {
                if (!arguments.length) return startRadius;
                startRadius = endRadius = _;
                return link;
            };

            link.startRadius = function(_) {
                if (!arguments.length) return startRadius;
                startRadius = _;
                return link;
            };

            link.endRadius = function(_) {
                if (!arguments.length) return endRadius;
                endRadius = _;
                return link;
            };

            return link;
            }

            function degrees(radians) {
            return radians / Math.PI * 180 - 90;
            }


        }
    });
    return HivePlot;
});
