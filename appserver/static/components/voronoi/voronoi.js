define(function(require, exports, module) {

    var _ = require('underscore');
    var d3 = require("../d3/d3");
    var queue = require("./queue");
    var topojson = require("./topojson");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");

    require("css!./voronoi.css");

    var Voronoi = SimpleSplunkView.extend({

        className: "splunk-toolkit-voronoi-map",

        options: {
            managerid: null,
            data: "preview",
            src_label_field: "src",
            src_lat_field: "src_lat",
            src_lon_field: "src_lon",
            dst_label_field: "dst",
            dst_lat_field: "dst_lat",
            dst_lon_field: "dst_lon",
            count_field: "count",
            height: 600
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
            this.settings.on("change:src_label_field", this.render, this);
            this.settings.on("change:src_lat_field", this.render, this);
            this.settings.on("change:src_lon_field", this.render, this);
            this.settings.on("change:dst_label", this.render, this);
            this.settings.on("change:dst_lat_field", this.render, this);
            this.settings.on("change:dst_lon_field", this.render, this);
            this.settings.on("change:count_field", this.render, this);

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

            var src_label_field = that.settings.get("src_label_field");
            var src_lat_field   = that.settings.get("src_lat_field");
            var src_lon_field   = that.settings.get("src_lon_field");
            var dst_label_field = that.settings.get("dst_label_field");
            var dst_lat_field   = that.settings.get("dst_lat_field");
            var dst_lon_field   = that.settings.get("dst_lon_field");

            var count_field = that.settings.get("count_field");

            var height = that.settings.get("height");
            var width = that.$el.width();

            that.$el.html("");

            var projection = d3.geo.albers()
                .translate([width / 2, height / 2])
                .scale(1080);

            var path = d3.geo.path()
                .projection(projection);

            var voronoi = d3.geom.voronoi()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .clipExtent([[0, 0], [width, height]]);

            var svg = d3.select(that.el).append("svg")
                .attr("width", width)
                .attr("height", height);

            queue()
                .defer(d3.json, "/static/app/custom_vizs/components/voronoi/us.json")
                .await(ready);

            function ready(error, us) {
            if (error) throw error;

            var get_points_by_id = d3.map(),
                positions = [];

            var src = _(data).chain().groupBy(src_label_field).each(function(v, k, o) { o[k] = v[0] }).value();
            var dst = _(data).chain().groupBy(dst_label_field).each(function(v, k, o) { o[k] = v[0] }).value();

            var uniques = _(src).extend(dst);

            var points = _(uniques).map(function(v, k) {
                var o = {};

                o.id = k;

                if(v.from === k) {
                    o.lat = v[src_lat_field];
                    o.lon = v[src_lon_field];
                }
                else {
                    o.lat = v[dst_lat_field];
                    o.lon = v[dst_lon_field];
                }

                return o;
            });

            points.forEach(function(d) {
                get_points_by_id.set(d.id, d);
                d.outgoing = [];
                d.incoming = [];
            });

            data.forEach(function(connection) {
                var source = get_points_by_id.get(connection[src_label_field]),
                    target = get_points_by_id.get(connection[dst_label_field]),
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

            svg.append("path")
                .datum(topojson.feature(us, us.objects.land))
                .attr("class", "regions")
                .attr("d", path);

            svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("class", "region-borders")
                .attr("d", path);

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
                .attr("r", function(d, i) { return Math.sqrt(d[count_field]); });

            }
        }
    });
    return Voronoi;
});
