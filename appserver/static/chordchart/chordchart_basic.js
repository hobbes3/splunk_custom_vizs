// Chord chart D3.js code taken and modified from http://bost.ocks.org/mike/uberdata/ by Mike Bostock

define(function(require, exports, module) {
    var _ = require("underscore");
    var d3 = require("../d3/d3");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    require("css!./chordchart_basic.css");

    var ChordChart = SimpleSplunkView.extend({
        className: "splunk-toolkit-chord-chart",
        options: {
            "managerid": null,
            "data": "preview"
        },
        output_mode: "json",
        initialize: function() {
            _(this.options).extend({
                "src_colors": {},
                // Used internally for knowing the order of the src values
                "src_order": [],
                "splunk_color_range": ["#6bb7c8", "#fac61d", "#d85e3d", "#956e96", "#f7912c", "#9ac23c", "#998c55", "#dd87b0", "#5479af", "#e0a93b", "#6b8930", "#a04558", "#a7d4df", "#fcdd77", "#e89e8b", "#bfa8c0", "#fabd80", "#c2da8a", "#c2ba99", "#ebb7d0", "#98afcf", "#eccb89", "#a6b883", "#c68f9b", "#416e79", "#967711", "#823825", "#59425a", "#94571a", "#5c7424", "#5c5433", "#85516a", "#324969", "#866523", "#40521d", "#602935"]
            });

            SimpleSplunkView.prototype.initialize.apply(this, arguments);
        },
        createView: function() {
            return true;
        },
        // Making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            var that = this;

            var total = _(data)
                .pluck("count")
                .reduce(function(memo, value) {
                    return memo + parseInt(value);
                }, 0);

            var src_order = _(data)
                .chain()
                .map(function(row) {
                    return [row.from, row.to];
                })
                .flatten()
                .uniq()
                .value();

            that.options.src_order = src_order;

            splunk_color_range = that.options.splunk_color_range;

            var all_combinations = _(src_order)
                .chain()
                .map(function(src, i) {
                    // If a src color isn't set from Simple XML then assign one based off the `colors` option (d3, splunk, or random)
                    if(!_(that.options.src_colors).has(src)) {
                        that.options.src_colors[src] = splunk_color_range[i % splunk_color_range.length];
                    }

                    return _(src_order).map(function(dst) {
                        var combination = {};
                        combination.from = src;
                        combination.to   = dst;
                        // Both the original count value and this will be converted to a integer later
                        combination.count = "0";
                        return combination;
                    });
                })
                .flatten()
                .value();

            var all_data = _(all_combinations).map(function(row) {
                var found_row = _(data).findWhere(_(row).pick("from", "to"));
                return found_row === undefined ? row : found_row;
            });

            formatted_data = _(all_data)
                .chain()
                .groupBy("from")
                .map(function(dst, src) {
                    return _(dst).map(function(v) {
                        return parseInt(v.count) / total;
                    });
                })
                .value();

            return formatted_data; // this is passed into updateView as 'data'
        },
        updateView: function(viz, data) {
            var that = this;
            var width  = 800;
            var height = 800;

            // clearing all prior junk from the view (eg. 'waiting for data...')
            that.$el.html("");

            var chordchart_svg = d3.select(that.el)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("pointer-events", "all");

            var src_colors = that.options.src_colors;
            var src_order  = that.options.src_order;

            var outerRadius = Math.min(width, height) / 2 - 10;
            var innerRadius = outerRadius - 24;

            var formatPercent = d3.format(".1%");

            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            var layout = d3.layout.chord()
                .padding(0.04)
                .sortSubgroups(d3.descending)
                .sortChords(d3.ascending);

            var path = d3.svg.chord()
                .radius(innerRadius);

            var svg = chordchart_svg.append("g")
                .attr("id", "circle")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.append("circle")
                .attr("r", outerRadius);

            // Compute the chord layout.
            layout.matrix(data);

            // Add a group per neighborhood.
            var group = svg.selectAll(".group")
                .data(layout.groups)
                .enter().append("g")
                .attr("class", "group")
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);

            // Add a mouseover title.
            group.append("title").text(function(d, i) {
                return src_order[i] + ": " + formatPercent(d.value) + " of origins";
            });

            // Add the group arc.
            var groupPath = group.append("path")
                .attr("id", function(d, i) { return "group" + i; })
                .attr("d", arc)
                .style("fill", function(d, i) { return src_colors[src_order[i]]; });

            // Add a text label.
            var groupText = group.append("text")
                .attr("x", 6)
                .attr("dy", 15);

            groupText.append("textPath")
                .attr("xlink:href", function(d, i) { return "#group" + i; })
                .text(function(d, i) { return src_order[i]; });

            // Remove the labels that don't fit. :(
            groupText.filter(function(d, i) {
                return groupPath[0][i].getTotalLength() / 2 - 30 < this.getComputedTextLength();
            }).remove();

            // Add the chords.
            var chord = svg.selectAll(".chord")
                .data(layout.chords)
                .enter().append("path")
                .attr("class", "chord")
                .style("fill", function(d) { return src_colors[src_order[d.source.index]]; })
                .attr("d", path);

            // Add an elaborate mouseover title for each chord.
            chord.append("title").text(function(d) {
                return src_order[d.source.index] +
                    " → " + src_order[d.target.index] +
                    ": " + formatPercent(d.source.value) +
                    "\n" + src_order[d.target.index] +
                    " → " + src_order[d.source.index] +
                    ": " + formatPercent(d.target.value);
            });

            function mouseover(d, i) {
                chord.classed("fade", function(p) {
                    return p.source.index != i && p.target.index != i;
                });
            }

            function mouseout(d, i) {
                chord.classed("fade", false);
            }
        }
    });
    return ChordChart;
});
