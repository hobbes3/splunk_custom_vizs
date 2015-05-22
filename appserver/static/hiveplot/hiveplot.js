// Hive plot D3.js code taken and modified from http://bl.ocks.org/mbostock/2066415 by Mike Bostock

define(function(require, exports, module) {
    var _ = require("underscore");
    var d3 = require("../d3/d3.hive");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    require("css!./hiveplot.css");

    var HivePlot = SimpleSplunkView.extend({
        className: "splunk-toolkit-hive-plot",
        options: {
            "managerid": null,
            "data": "preview",
            "height": 900,
            "src_field": "src",
            "value_field": "value",
            "property_field": "property",
            "dest_field": "dest",
            "category_field": "category",
            "category_order": null,
            "links_name": "links",
            "nodes_name": "nodes"
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
            var category_order = that.settings.get("category_order");

            var formatted_data = {};

            var a = _(data).first();

            var categories = category_order || _(data).chain().pluck("region").uniq().compact().value();
            var min = _(data).chain().map(function(o) { return parseFloat(o.population); }).min().value();
            var max = _(data).chain().map(function(o) { return parseFloat(o.population); }).max().value();
            var range = max - min;

            var nodes_info = _(data).filter(function(o) { return o.population; });

            var nodes = _(data)
                .chain()
                .uniq(function(o) { return o.from; })
                .map(function(o) {
                    var name = o.from;
                    var region = _(nodes_info).findWhere({from: name}).region;
                    var population = parseFloat(_(nodes_info).findWhere({from: name}).population);

                    return {
                        name: name,
                        x: categories.indexOf(region),
                        y: (population - min)/range,
                        population: population,
                        region: region,
                        sources: [],
                        targets: []
                    };
                })
                .value();

            var links = _(data)
                .chain()
                .filter(function(o) { return o.from && o.to; })
                .map(function(o) {
                    var source = _(nodes).findWhere({name: o.from});
                    var target = _(nodes).findWhere({name: o.to});

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

            // clearing all prior junk from the view (eg. 'waiting for data...')
            that.$el.html("");

            var nodes = data.nodes;
            var links = data.links;
            var axes  = data.axes;

            var width = 960,
                height = 500,
                innerRadius = 40,
                outerRadius = 240;

            var angle = d3.scale.ordinal().domain(d3.range(axes + 1)).rangePoints([0, 2 * Math.PI]),
                radius = d3.scale.linear().range([innerRadius, outerRadius]),
                color = d3.scale.category10().domain(d3.range(20));

            var formatNumber = d3.format(",d"),
                formatCommaNumber = d3.format("0,000"),
                defaultInfo;

            var links_name = that.settings.get("links_name");
            var nodes_name = that.settings.get("nodes_name");

            // Initialize the info display.
            var info = d3.select("#info")
                .text(defaultInfo = "Showing " + formatNumber(links.length) + " " + links_name + " among " + formatNumber(nodes.length) + " " + nodes_name + ".");


            var svg = d3.select(that.el).append("svg")
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
                .attr("class", "node");

            node.append("circle")
                .attr("class", "node")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
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

            node.append("text")
                .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
                .attr("dx", function(d) { return radius(d.y); })
                .attr("dy", ".35em")
                .text(function(d) { return d.name });

            function degrees(radians) {
                return radians / Math.PI * 180 - 90;
            }

            // Highlight the link and connected nodes on mouseover.
            function linkMouseover(d) {
                svg.selectAll(".link")
                    .classed("active", function(p) {
                        return p === d;
                    });
                svg.selectAll(".node")
                    .classed("active", function(p) {
                        return p === d.source || p === d.target;
                    });
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
                info.text("Country: " + d.name + ", Region: " + d.region + ", Population: " + formatCommaNumber(d.population));
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
