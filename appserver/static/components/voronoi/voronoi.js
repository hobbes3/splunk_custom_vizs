// Voronoi Map D3.js code taken and modified from http://bl.ocks.org/mbostock/7608400 by Mike Bostock

define(function(require, exports, module) {
    var _ = require('underscore');
    var d3 = require("../d3/d3");
    var geo = require("../d3/d3.geo.projection");
    var topojson = require("../d3/topojson");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");

    require("css!./voronoi.css");

    var Voronoi = SimpleSplunkView.extend({

        className: "splunk-toolkit-voronoi-map",

        options: {
            managerid: null,
            data: "preview",
            src_field: "src",
            src_lat_field: "src_lat",
            src_lon_field: "src_lon",
            dst_field: "dst",
            dst_lat_field: "dst_lat",
            dst_lon_field: "dst_lon",
            count_field: "count",
            center_lat: 0,
            center_lon: 0,
            zoom: 250,
            min_circle_size: 3,
            max_circle_size: 20,
            height: 800
        },

        output_mode: "json",

        initialize: function() {
            _.extend(this.options, {
            });
            SimpleSplunkView.prototype.initialize.apply(this, arguments);

            this.settings.enablePush("value");

            // in the case that any options are changed, it will dynamically update
            // without having to refresh. copy the following line for whichever field
            // you'd like dynamic updating on
            this.settings.on("change:src_field",     this.render, this);
            this.settings.on("change:src_lat_field", this.render, this);
            this.settings.on("change:src_lon_field", this.render, this);
            this.settings.on("change:dst_label",     this.render, this);
            this.settings.on("change:dst_lat_field", this.render, this);
            this.settings.on("change:dst_lon_field", this.render, this);
            this.settings.on("change:count_field",   this.render, this);

            // Set up resize callback. The first argument is a this
            // pointer which gets passed into the callback event
            $(window).resize(this, _.debounce(this._handleResize, 20));
        },

        _handleResize: function(e) {

            // e.data is the this pointer passed to the callback.
            // here it refers to this object and we call render()
            e.data.render();
        },

        createView: function() {

            // The returned object gets passed to updateView as viz
            return true;
        },

        // making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            return data;
        },

        updateView: function(viz, data) {
            var that = this;

            var src_field     = that.settings.get("src_field");
            var src_lat_field = that.settings.get("src_lat_field");
            var src_lon_field = that.settings.get("src_lon_field");
            var dst_field     = that.settings.get("dst_field");
            var dst_lat_field = that.settings.get("dst_lat_field");
            var dst_lon_field = that.settings.get("dst_lon_field");
            var count_field   = that.settings.get("count_field");

            var center_lat = that.settings.get("center_lat");
            var center_lon = that.settings.get("center_lon");
            var zoom       = that.settings.get("zoom");

            var min_circle_size = that.settings.get("min_circle_size");
            var max_circle_size = that.settings.get("max_circle_size");

            var height = that.settings.get("height");
            var width = that.$el.width();

            that.$el.html("");

            var projection = d3.geo.kavrayskiy7()
                .center([center_lon, center_lat])
                .scale(zoom)
                .translate([width / 2, height / 2])

            var graticule = d3.geo.graticule();

            var path = d3.geo.path()
                .projection(projection);

            var voronoi = d3.geom.voronoi()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .clipExtent([[0, 0], [width, height]]);

            var svg = d3.select(that.el).append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("path")
                .datum(graticule)
                .attr("class", "graticule")
                .attr("d", path);

            svg.append("path")
                .datum(graticule.outline)
                .attr("class", "graticule outline")
                .attr("d", path);

            d3.json("/static/app/custom_vizs/components/voronoi/readme-world.json", function(error, world) {
                var countries = topojson.feature(world, world.objects.countries).features,
                    neighbors = topojson.neighbors(world.objects.countries.geometries);

                svg.selectAll(".country")
                    .data(countries)
                    .enter().insert("path", ".graticule")
                    .attr("class", "country")
                    .attr("d", path);

                var format = d3.format(",");

                var get_points_by_id = d3.map(),
                    positions = [];

                var src = _(data).chain().groupBy(src_field).each(function(v, k, o) { o[k] = v; }).value();
                var dst = _(data).chain().groupBy(dst_field).each(function(v, k, o) { o[k] = v; }).value();

                var uniques = _(dst).extend(src);

                var max = 0;

                var points = _(uniques).map(function(v, k) {
                    var o = {};

                    o.id = k;
                    o.value = _(v).pluck(count_field).reduce(function(memo, num) { return memo + parseFloat(num); }, 0);

                    max = Math.max(max, o.value);

                    if(v[0][src_field] === k) {
                        o.lat = v[0][src_lat_field];
                        o.lon = v[0][src_lon_field];
                    }
                    else {
                        o.lat = v[0][dst_lat_field];
                        o.lon = v[0][dst_lon_field];
                    }

                    return o;
                });

                points.forEach(function(d) {
                    get_points_by_id.set(d.id, d);
                    d.outgoing = [];
                    d.incoming = [];
                });

                data.forEach(function(connection) {
                    var source = get_points_by_id.get(connection[src_field]),
                        target = get_points_by_id.get(connection[dst_field]),
                        link = {source: source, target: target};
                    source.outgoing.push(link);
                    target.incoming.push(link);
                });

                points = points.filter(function(d) {
                    if (d.count = Math.max(d.incoming.length, d.outgoing.length)) {
                    d[0] = +d.lon;
                    d[1] = +d.lat;
                    var position = projection(d);
                    d.x = position[0];
                    d.y = position[1];
                    return true;
                    }
                });

                voronoi(points)
                    .forEach(function(d) { d.point.cell = d; });

                var point = svg.append("g")
                    .attr("class", "points")
                    .selectAll("g")
                    .data(points.sort(function(a, b) { return b[count_field] - a[count_field]; }))
                    .enter().append("g")
                    .attr("class", "point");

                point.append("path")
                    .attr("class", "point-cell")
                    .attr("d", function(d) { return d.cell.length ? "M" + d.cell.join("L") + "Z" : null; });

                point.append("g")
                    .attr("class", "point-arcs")
                    .selectAll("path")
                    .data(function(d) { return d.outgoing; })
                    .enter().append("path")
                    .attr("d", function(d) { return path({type: "LineString", coordinates: [d.source, d.target]}); });

                point.append("circle")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .attr("r", function(d, i) { return d.value/max*(max_circle_size-min_circle_size)+min_circle_size; });

                point.append("title")
                    .text(function(d) {
                        return d.id + ": " +
                            format(d.outgoing.length) + " distinct outgoing, " +
                            format(d.incoming.length) + " distinct incoming, " +
                            format(d.value) + " total";
                    });
            });
        }
    });
    return Voronoi;
});
