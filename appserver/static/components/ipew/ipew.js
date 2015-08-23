// IPew Map D3.js code taken and modified from http://ocularwarfare.com/ipew/ by Bob Rudis

define(function(require, exports, module) {
    var _ = require("underscore");
    var d3 = require("../d3/d3");
    var d3_geo = require("../d3/d3.geo.projection");
    var topojson = require("../d3/topojson");
    var Datamap = require("../d3/datamaps.world");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");

    var IPew = SimpleSplunkView.extend({
        className: "splunk-ipew",
        options: {
            "managerid": null,
            "data": "preview"
        },
        output_mode: "json",
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
            // In the case that any options are changed, it will dynamically update without having to refresh
            // Copy the following line for whichever field you'd like dynamic updating on
            this.settings.on("change:count_field", this.render, this);
        },
        createView: function() {
            var that = this;

            // clearing all prior junk from the view (eg. 'waiting for data...')
            that.$el.html("");

            function FixedQueue(size, initialValues) {
                initialValues = initialValues || [];
                var queue = Array.apply(null, initialValues);
                queue.fixedSize = size;
                queue.push = FixedQueue.push;
                queue.splice = FixedQueue.splice;
                queue.unshift = FixedQueue.unshift;
                FixedQueue.trimTail.call(queue);
                return queue;
            }

            FixedQueue.trimHead = function() {
                if(this.length <= this.fixedSize) {
                    return;
                }
                Array.prototype.splice.call(this, 0, this.length - this.fixedSize);
            };
            FixedQueue.trimTail = function() {
                if (this.length <= this.fixedSize) {
                    return;
                }
                Array.prototype.splice.call(this, this.fixedSize, this.length - this.fixedSize);
            };
            FixedQueue.wrapMethod = function(methodName, trimMethod) {
                var wrapper = function() {
                    var method = Array.prototype[ methodName ];
                    var result = method.apply( this, arguments );
                    trimMethod.call( this );
                    return result;
                };
                return wrapper;
            };
            FixedQueue.push = FixedQueue.wrapMethod("push", FixedQueue.trimHead);
            FixedQueue.splice = FixedQueue.wrapMethod("splice", FixedQueue.trimTail);
            FixedQueue.unshift = FixedQueue.wrapMethod("unshift", FixedQueue.trimTail);

            var map = new Datamap({
                scope: 'world',
                element: that.el,
                height: 900,
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

            $("body").append('<audio id="pew_sound" src="/static/app/custom_vizs/components/ipew/Blaster-Solo.wav" preload="auto">');

            that.hits = FixedQueue(7, [  ]);
            that.boom = FixedQueue(7, [  ]);

            return map;
        },
        // Making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            return data; // this is passed into updateView as 'data'
        },
        updateView: function(map, data) {
            var that = this;

            document.getElementById("pew_sound").load();
            document.getElementById("pew_sound").play();

            var srclat = data[0].src_lat;
            var srclong = data[0].src_lon;
            var dstlat = data[0].dst_lat;
            var dstlong = data[0].dst_lon;

            var strokeColor = 'green';

            that.hits.push({
                origin: {
                    latitude: +srclat,
                    longitude: +srclong
                },
                destination: {
                    latitude: +dstlat,
                    longitude: +dstlong
                }
            });
            map.arc(that.hits, {
                strokeWidth: 2,
                strokeColor: strokeColor
            });
            // add boom to the bubbles queue
            that.boom.push({
                radius: 7,
                latitude: +dstlat,
                longitude: +dstlong,
                fillOpacity: 0.5,
                attk: data[0].type
            });
            map.bubbles(that.boom, {
                popupTemplate: function(geo, data) {
                    return '<div class="hoverinfo">' + data.attk + '</div>';
                }
            });
        }
    });
    return IPew;
});
