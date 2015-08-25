// IPew Map D3.js code taken and modified from http://ocularwarfare.com/ipew/ by Bob Rudis

define(function(require, exports, module) {
    var _ = require("underscore");
    var d3 = require("../d3/d3");
    var d3_geo = require("../d3/d3.geo.projection");
    var topojson = require("../d3/topojson");
    var Datamap = require("../d3/datamaps.world");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    require("css!./ipew.css");

    var IPew = SimpleSplunkView.extend({
        className: "splunk-ipew",
        options: {
            "managerid": null,
            "data": "preview",
            "height": 800,
            "src_lat_field": "src_lat",
            "src_lon_field": "src_lon",
            "dst_lat_field": "dst_lat",
            "dst_lon_field": "dst_lon",
            "type_field": "type",
            "id_field": "id",
            "sound_filename": "/static/app/custom_vizs/components/ipew/Blaster-Solo.wav",
            "stroke_color": "green",
            "stroke_width": 2,
            "queue": 7,
            "limit": 2
        },
        output_mode: "json",
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
            // In the case that any options are changed, it will dynamically update without having to refresh
            // Copy the following line for whichever field you'd like dynamic updating on
            this.settings.on("change:src_lat_field", this.render, this);
            this.settings.on("change:src_lon_field", this.render, this);
            this.settings.on("change:dst_lat_field", this.render, this);
            this.settings.on("change:dst_lon_field", this.render, this);
            this.settings.on("change:type_field",    this.render, this);
            this.settings.on("change:id_field",      this.render, this);
        },
        createView: function() {
            var that = this;

            // clearing all prior junk from the view (eg. 'waiting for data...')
            that.$el.html("");

            var height = that.settings.get("height");
            var sound_filename = that.settings.get("sound_filename");

            var map = new Datamap({
                scope: 'world',
                element: that.el,
                height: height,
                projection: 'winkel3',
                // change the projection to something else only if you have absolutely no cartographic sense
                fills: { defaultFill: 'black', },
                geographyConfig: {
                dataUrl: null,
                hideAntarctica: true,
                borderWidth: 0.75,
                borderColor: '#4393c3',
                popupTemplate: function(geography, data) {
                    return '<div class="hoverinfo" style="color:white;background:black">' +
                        geography.properties.name + '</div>';
                },
                popupOnHover: true,
                highlightOnHover: false,
                highlightFillColor: 'black',
                highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
                highlightBorderWidth: 2
                },
            });

            if(sound_filename) {
                $("body").append('<audio id="pew_sound" src="' + sound_filename + '" preload="auto">');
            }

            that.last_event = "";

            that.hits = [];
            that.boom = [];

            return map;
        },
        // Making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            return data; // this is passed into updateView as 'data'
        },
        updateView: function(map, data) {
            var that = this;

            clearTimeout(that.timer);

            var src_lat_field = that.settings.get("src_lat_field");
            var src_lon_field = that.settings.get("src_lon_field");
            var dst_lat_field = that.settings.get("dst_lat_field");
            var dst_lon_field = that.settings.get("dst_lon_field");
            var type_field    = that.settings.get("type_field");
            var id_field      = that.settings.get("id_field");

            var sound_filename = that.settings.get("sound_filename");
            var stroke_color = that.settings.get("stroke_color");
            var stroke_width = that.settings.get("stroke_width");
            var queue = that.settings.get("queue");
            var limit = that.settings.get("limit");

            if(sound_filename) {
                document.getElementById("pew_sound").load();
                document.getElementById("pew_sound").play();
            }

            var i;
            for(i = 0; i < limit; i++) {
                var src_lat = data[i][src_lat_field];
                var src_lon = data[i][src_lon_field];
                var dst_lat = data[i][dst_lat_field];
                var dst_lon = data[i][dst_lon_field];
                var type    = data[i][type_field];
                var id      = data[i][id_field];

                var raw_event = data[i][id_field];

                if(raw_event === that.last_event) {
                    break;
                }

                that.hits.push({
                    origin: {
                        latitude: +src_lat,
                        longitude: +src_lon
                    },
                    destination: {
                        latitude: +dst_lat,
                        longitude: +dst_lon
                    }
                });
                map.arc(that.hits, {
                    strokeWidth: stroke_width,
                    strokeColor: stroke_color
                });
                // add boom to the bubbles queue
                that.boom.push({
                    radius: 7,
                    latitude: +dst_lat,
                    longitude: +dst_lon,
                    fillOpacity: 0.5,
                    attk: data[i][type_field]
                });
                map.bubbles(that.boom, {
                    popupTemplate: function(geo, data) {
                        return '<div class="hoverinfo">' + data.attk + '</div>';
                    }
                });

                var length = that.hits.length;

                if(length > queue) {
                    that.hits.shift();
                    that.boom.shift();
                }
            }

            that.last_event = data[0][id_field];
        }
    });
    return IPew;
});
