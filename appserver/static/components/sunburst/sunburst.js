define(function(require, exports, module) {

    var _ = require('underscore');
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    var nester = require("../underscore-nest/underscore-nest");
    var d3 = require("../d3/d3");

    require("css!./sunburst.css");

    window.nester = nester;
    var ANIMATION_DURATION = 500;  // milliseconds

    var Sunburst = SimpleSplunkView.extend({
        moduleId: module.id,

        className: "splunk-toolkit-sunburst",

        options: {
            managerid: null,
            data: 'preview',
            root_label: "",
            value_field: null,
            category_fields: null,
            truncate_value: 0,
            format_label: _.identity,
            format_tooltip: function(d) {
                return (d.name || "Total") + ": " + d.value;
            }
        },

        output_mode: "json",

        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);

            this.settings.on("change:value_field", this.render, this);
            this.settings.on("change:category_fields", this.render, this);
            this.settings.on("change:format_label change:format_tooltip change:root_label", this.render, this);

            // Set up resize callback.
            $(window).resize(_.debounce(_.bind(this._handleResize, this), 20));
        },

        _handleResize: function() {
            this.render();
        },

        createView: function() {
            // Here we wet up the initial view layout
            var margin = {top: 30, right: 30, bottom: 30, left: 30};
            var availableWidth = parseInt(this.settings.get("width") || this.$el.width());
            var availableHeight = parseInt(this.settings.get("height") || this.$el.height());

            this.$el.html("");

            var svg = d3.select(this.el)
                .append("svg")
                .attr("width", availableWidth)
                .attr("height", availableHeight)
                .attr("pointer-events", "all");

            // The returned object gets passed to updateView as viz
            return { container: this.$el, svg: svg, margin: margin};
        },

        // making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            var value_field = this.settings.get("value_field");
            var category_fields = this.settings.get("category_fields");
            var color_field = this.settings.get("color_field");

            if(!category_fields) {
                category_fields = this.resultsModel.data().fields;
            }

            var get_sum = function(list) {
                return _(list).pluck(list[0].length - 1).reduce(function(memo, num) { return memo + num; }, 0);
            };

            var nest = function(list, group_by) {
                var groups = _(list).groupBy(group_by);

                return _(groups).map(function(value, key) {
                    var children = _(value)
                        .chain()
                        .each(function(v) {
                            delete v[group_by];
                            return v;
                        })
                        .compact()
                        .value();

                    var colors;
                    if(color_field) {
                        colors = _(children).chain().pluck(color_field).uniq().value();
                    }

                    var node = {};
                    var intersection = _(_(children[0]).keys()).intersection(category_fields);

                    if(intersection.length === 0) {
                        node = {
                            "name": key,
                            "value": 1,
                            "data": children[0]
                        };

                        if(colors) {
                            node.colors = colors;
                        }
                    }
                    else {
                        node.name = key;

                        if(colors) {
                            node.colors = colors;
                        }

                        node.children = nest(children, intersection[0]);
                    }

                    return node;
                });
            };

            data_results = nest(data, category_fields[0]);

            var root_label = this.settings.get("root_label") || "";

            formatted_data = {
                "name": root_label,
                "children": data_results
            };

            if(color_field) {
                formatted_data.colors = _(data).chain().pluck(color_field).uniq().value();
            }

            return formatted_data;
        },

        updateView: function(viz, data) {
            var root_color = this.settings.get("root_color");
            var color_field = this.settings.get("color_field");
            var colors = this.settings.get("colors");
            var propagate = this.settings.get("propagate");

            var format_label = this.settings.get("format_label") || _.identity;
            var format_tooltip = this.settings.get("format_tooltip") || function(d) { return d.name; };
            var truncate_value = this.settings.get("truncate_value");
            var containerHeight = this.$el.height();
            var containerWidth = this.$el.width();

            // Clear svg
            var svg = $(viz.svg[0]);
            svg.empty();
            svg.height(containerHeight);
            svg.width(containerWidth);

            // Add the graph group as a child of the main svg
            var graphWidth = containerWidth - viz.margin.left - viz.margin.right;
            var graphHeight = containerHeight - viz.margin.top - viz.margin.bottom;
            var graph = viz.svg
                .append("g")
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .attr("transform", "translate("
                        + ((graphWidth/2) + viz.margin.left ) + ","
                        + ((graphHeight/2) + viz.margin.top ) + ")");

            var radius = Math.min(graphWidth, graphHeight) / 2;

            var color_range = d3.scale.category20c();

            var x = d3.scale.linear()
                .range([0, 2 * Math.PI]);

            var y = d3.scale.linear()
                .range([0, radius]);

            var partition = d3.layout.partition()
                .value(function(d) {
                    return d.value;
                });

            var arc = d3.svg.arc()
                .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

            var g = graph.selectAll("g")
                .data(partition.nodes(data))
                .enter().append("g");

            var path = g.append("path")
                .attr("d", arc)
                .style("fill", function(d) {
                    var fill_color;

                    if(root_color && !("parent" in d)) {
                        return root_color;
                    }

                    if(color_field) {
                        if(propagate) {
                            _(colors).every(function(v) {
                                var color = _(v).keys()[0];
                                if(d.colors.indexOf(color) > -1) {
                                    fill_color = v[color];
                                    return false;
                                }

                                return true;
                            });
                        }
                        else if(d.data) {
                            var color = d.data[color_field];

                            _(colors).every(function(v) {
                                if(_(v).has(color)) {
                                    fill_color = v[color];
                                    return false;
                                }

                                return true;
                            });
                        }
                    }

                    return fill_color ? fill_color : color_range((d.children ? d : d.parent).name);
                })
                .on("click", click);

            path.append("title")
                .text(format_tooltip);

            var textAnchorPos = function(depthMarker) {
                return function(d) {
                    return (d.depth === depthMarker) ? 'middle' : ((x(d.x + d.dx / 2) > Math.PI) ? "end" : "start");
                };
            };

            var textTransform = function(depthMarker) {
                return function(d) {
                    // Objects at the origin don't need to be rotated
                    var angle = x(d.x + d.dx / 2) * 180 / Math.PI + (d.depth === depthMarker ? 0 : -90);
                    // Objects at the origin don't need to be moved.
                    // "5" pads the text off the drawn circle.
                    var translation = d.depth === depthMarker ? 0 : (y(d.y) + 5);
                    var rotate = angle;
                    return "rotate(" + rotate + ")translate(" + (translation) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
                };
            };

            var text = g.append("text")
                .attr("text-anchor", textAnchorPos(0))
                .attr("transform", textTransform(0))
                .attr("dy", ".2em")
                .attr("x", 0)
                .text(function(d) {
                    var sliceWidth = Math.abs(Math.max(0, y(d.y)) - Math.max(0, y(d.y + d.dy)));
                    var formatted = format_label(d.name);

                    // Trunctate the title
                    return formatted.substring(0, sliceWidth / truncate_value);
                })
                .on("click", click);

            text.append("title")
                .text(format_tooltip);

            function click(d) {
                // The "at depth" object is treated differently;
                // centered and not rotated.
                var depthMarker = d.depth;
                // fade out all text elements
                text.transition().attr("opacity", 0);
                path.transition()
                  .duration(ANIMATION_DURATION)
                  .attrTween("d", arcTween(d))
                  .each("end", function(e, i) {
                      // check if the animated element's data e lies
                      // within the visible angle span given in d and
                      // the element is d or a possible child of d
                      if ((e.x >= d.x && e.x < (d.x + d.dx)) && (e.depth >= d.depth)) {
                        // get a selection of the associated text element
                        var arcText = d3.select(this.parentNode).select("text");
                        // fade in the text element and recalculate positions
                        arcText.transition().duration(ANIMATION_DURATION)
                            .attr("opacity", 1)
                            .attr("text-anchor", textAnchorPos(depthMarker))
                            .attr("transform", textTransform(depthMarker))
                            .attr("dy", ".2em")
                            .attr("x", 0);
                      }
                  });
            }

            // Interpolate the scales!
            function arcTween(d) {
              var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                  yd = d3.interpolate(y.domain(), [d.y, 1]),
                  yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
              return function(d, i) {
                return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
              };
            }
        }
    });
    return Sunburst;
});
