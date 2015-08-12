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
            nameField: null,
            valueField: 'count',
            categoryField: null
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
            this.settings.on("change:foo", this.render, this);

            // Set up resize callback. The first argument is a this
            // pointer which gets passed into the callback event
            //$(window).resize(this, _.debounce(this._handleResize, 20));
        },

        _handleResize: function(e){

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
            // getting settings
            return data;
        },

        updateView: function(viz, data) {
            var that = this;

            that.$el.html("");

            var width = 960,
                height = 500;

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
                .defer(d3.csv, "/static/app/custom_vizs/components/voronoi/airports.csv")
                .defer(d3.csv, "/static/app/custom_vizs/components/voronoi/flights.csv")
                .await(ready);

            function ready(error, us, airports, flights) {
            if (error) throw error;

            var airportById = d3.map(),
                positions = [];

            airports.forEach(function(d) {
                airportById.set(d.iata, d);
                d.outgoing = [];
                d.incoming = [];
            });

            flights.forEach(function(flight) {
                var source = airportById.get(flight.origin),
                    target = airportById.get(flight.destination),
                    link = {source: source, target: target};
                source.outgoing.push(link);
                target.incoming.push(link);
            });

            airports = airports.filter(function(d) {
                if (d.count = Math.max(d.incoming.length, d.outgoing.length)) {
                d[0] = +d.longitude;
                d[1] = +d.latitude;
                var position = projection(d);
                d.x = position[0];
                d.y = position[1];
                return true;
                }
            });

            voronoi(airports)
                .forEach(function(d) { d.point.cell = d; });

            svg.append("path")
                .datum(topojson.feature(us, us.objects.land))
                .attr("class", "states")
                .attr("d", path);

            svg.append("path")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("class", "state-borders")
                .attr("d", path);

            var airport = svg.append("g")
                .attr("class", "airports")
                .selectAll("g")
                .data(airports.sort(function(a, b) { return b.count - a.count; }))
                .enter().append("g")
                .attr("class", "airport");

            airport.append("path")
                .attr("class", "airport-cell")
                .attr("d", function(d) { return d.cell.length ? "M" + d.cell.join("L") + "Z" : null; });

            airport.append("g")
                .attr("class", "airport-arcs")
                .selectAll("path")
                .data(function(d) { return d.outgoing; })
                .enter().append("path")
                .attr("d", function(d) { return path({type: "LineString", coordinates: [d.source, d.target]}); });

            airport.append("circle")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .attr("r", function(d, i) { return Math.sqrt(d.count); });

            }
        }
    });
    return Voronoi;
});
