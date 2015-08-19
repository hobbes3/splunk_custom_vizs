// Hive plot D3.js code taken and modified from http://bl.ocks.org/mbostock/2066415 by Mike Bostock

define(function(require, exports, module) {
    var _ = require("underscore");
    var d3 = require("../d3/d3");
    var hive = require("./d3.hive");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    require("css!./hiveplot.css");

    var HivePlot = SimpleSplunkView.extend({
        className: "splunk-toolkit-hive-plot",
        options: {
            "managerid": null,
            "data": "preview",
            "height": 900,
            "src_field": "src",
            "src_category_field": "src_category",
            "src_value_field": "src_value",
            "dst_field": "dst",
            "dst_category_field": "dst_category",
            "dst_value_field": "dst_value",
            "category_order": null,
            "links_name": "links",
            "nodes_name": "nodes",
            "node_name": "Node",
            "category_name": "Category",
            "value_name": "Value",
            "labels": true
        },
        output_mode: "json",
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
            // In the case that any options are changed, it will dynamically update without having to refresh
            // Copy the following line for whichever field you'd like dynamic updating on

            this.settings.on("change:src_field",          this.render, this);
            this.settings.on("change:src_category_field", this.render, this);
            this.settings.on("change:src_value_field", this.render, this);
            this.settings.on("change:dst_field",          this.render, this);
            this.settings.on("change:dst_category_field", this.render, this);
            this.settings.on("change:dst_value_field", this.render, this);
        },
        createView: function() {
            // Clearing 'waiting for data...'
            this.$el.html("");

            // For centering
            this.$el.css({
                "width": this.settings.get("height")+100,
                "margin": "0 auto"
            });

            return true;
        },
        // Making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            var that = this;

            var src_field          = that.settings.get("src_field");
            var src_category_field = that.settings.get("src_category_field");
            var src_value_field = that.settings.get("src_value_field");
            var dst_field          = that.settings.get("dst_field");
            var dst_category_field = that.settings.get("dst_category_field");
            var dst_value_field = that.settings.get("dst_value_field");

            var category_order = that.settings.get("category_order");

            var formatted_data = {};

            var src_categories = _(data).chain().pluck(src_category_field).uniq().compact().value();
            var dst_categories = _(data).chain().pluck(dst_category_field).uniq().compact().value();

            var categories = _(src_categories).union(dst_categories);

            categories = _(category_order).intersection(categories).concat(_(categories).difference(category_order))

            var min = _(data).chain().map(function(o) { return Math.min(parseFloat(o[src_value_field]), parseFloat(o[dst_value_field])); }).min().value();
            var max = _(data).chain().map(function(o) { return Math.max(parseFloat(o[src_value_field]), parseFloat(o[dst_value_field])); }).max().value();
            var range = max - min;

            var src = _(data).chain().groupBy(src_field).each(function(v, k, o) { o[k] = v; }).value();
            var dst = _(data).chain().groupBy(dst_field).each(function(v, k, o) { o[k] = v; }).value();

            var uniques = _(dst).extend(src);

            var nodes = _(uniques).map(function(v, k) {
                o = {
                    name: k,
                    sources: [],
                    targets: []
                }

                var category;

                if(v[0][src_field] === k) {
                    category = v[0][src_category_field];
                    value = v[0][src_value_field];
                }
                else {
                    category = v[0][dst_category_field];
                    value = v[0][dst_value_field];
                }

                o.category = category;
                o.value = value;
                o.x = categories.indexOf(category);
                o.y = (value - min)/range;

                return o;
            });

            var links = _(data)
                .chain()
                .filter(function(o) { return o[src_field] && o[dst_field]; })
                .map(function(o) {
                    var source = _(nodes).findWhere({name: o[src_field]});
                    var target = _(nodes).findWhere({name: o[dst_field]});

                    source.targets.push(target);
                    target.sources.push(source);

                    return {
                        source: source,
                        target: target
                    };
                })
                .value();

            // this is passed into updateView as 'data'
            return {
                nodes: nodes,
                links: links,
                axes: categories.length
            };
        },
        updateView: function(viz, data) {
            var that = this;
            var height = that.settings.get("height");
            var width = this.$el.width();

            var nodes = data.nodes;
            var links = data.links;
            var axes  = data.axes;

            var innerRadius = 40,
                outerRadius = 240;

            var angle = d3.scale.ordinal().domain(d3.range(axes + 1)).rangePoints([0, 2 * Math.PI]),
                radius = d3.scale.linear().range([innerRadius, outerRadius]),
                color = d3.scale.category10().domain(d3.range(20));

            var formatNumber = d3.format(",d"),
                formatCommaNumber = d3.format("0,000"),
                defaultInfo;

            var nodes_name     = that.settings.get("nodes_name");
            var links_name     = that.settings.get("links_name");
            var node_name      = that.settings.get("node_name");
            var category_name  = that.settings.get("category_name");
            var value_name     = that.settings.get("value_name");
            var category_field = that.settings.get("category_field");
            var value_field    = that.settings.get("value_field");
            var labels         = that.settings.get("labels");

            // Initialize the info display.
            var info = d3.select("#info")
                .text(defaultInfo = "Showing " + formatNumber(links.length) + " " + links_name + " among " + formatNumber(nodes.length) + " " + nodes_name + ".");

            var svg = d3.select(that.el)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.selectAll(".axis")
                .data(d3.range(axes))
            .enter().append("line")
                .attr("class", "axis")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d)) + ")"; })
                .attr("x1", radius.range()[0])
                .attr("x2", radius.range()[1]);

            svg.selectAll(".link")
                .data(links)
            .enter().append("path")
                .attr("class", "link")
                .attr("d", d3.hive.link()
                .angle(function(d) { return angle(d.x); })
                .radius(function(d) { return radius(d.y); }))
                .style("stroke", function(d) { return color(d.source.x); })
                .on("mouseover", linkMouseover)
                .on("mouseout", mouseout)
                .append("svg:title")
                .text(function(d) {
                    return d.source.name + " → " + d.target.name;
                });

            var node = svg.selectAll(".node")
                .data(nodes)
            .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; });

            node.append("circle")
                .attr("class", "node")
                .attr("cx", function(d) { return radius(d.y); })
                .attr("r", 5)
                .style("fill", function(d) { return color(d.x); })
                .on("mouseover", nodeMouseover)
                .on("mouseout", mouseout)
                .append("svg:title")
                .text(function(d) {
                    var info = [];
                    _(d.targets).each(function(o) {
                        info.push(d.name + " → " + o.name);
                    });

                    _(d.sources).each(function(o) {
                        info.push(o.name + " → " + d.name);
                    });

                    return info.join("\n");
                });

            if(labels) {
                node.append("text")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + radius(d.y) + ",-10)rotate(-45)"; })
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name });
            }

            function degrees(radians) {
                return radians / Math.PI * 180 - 90;
            }

            // Highlight the link and connected nodes on mouseover.
            function linkMouseover(d) {
                svg.selectAll(".link")
                    .classed("active", function(p) {
                        return p === d;
                    })
                    .classed("hidden", function(p) {
                        return !(p === d);
                    });
                svg.selectAll(".node")
                    .classed("active", function(p) {
                        return p === d.source || p === d.target;
                    })
                    .classed("hidden", function(p) {
                        return !(p === d.source || p === d.target);
                    });
                svg.selectAll(".axis").classed("hidden", true);
                info.text(d.source.name + " → " + d.target.name);
            }

            // Highlight the node and connected links on mouseover.
            function nodeMouseover(d) {
                svg.selectAll(".link")
                    .classed("active", function(p) {
                        return p.source === d;
                    })
                    .classed("hidden", function(p) {
                        return p.source !== d;
                    });
                svg.selectAll(".node")
                    .classed("active", function(p) {
                        return p === d || d.targets.indexOf(p) > -1;
                    })
                    .classed("hidden", function(p) {
                        return !(p == d || d.targets.indexOf(p) > -1);
                    });
                svg.selectAll(".axis").classed("hidden", true);
                d3.select(this).classed("active", true);
                info.text(node_name + ": " + d.name + ", " + category_name + ": " + d.category + ", " + value_name + ": " + formatCommaNumber(d.value));
            }

            // Clear any highlighted nodes or links.
            function mouseout() {
                svg.selectAll(".active").classed("active", false);
                svg.selectAll(".hidden").classed("hidden", false);
                info.text(defaultInfo);
            }
        }
    });
    return HivePlot;
});
