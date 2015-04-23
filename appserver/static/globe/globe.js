define(function(require, exports, module) {
    var Detector = require("../globe/Detector");
    var DAT = require("../globe/DAT");
    var TWEEN = require("../globe/Tween");

    var THREE = require("three");

    var _ = require('underscore');
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    var SplunkUtil = require('splunk.util');

    var Globe = SimpleSplunkView.extend({
        className: "splunk-toolkit-globe",
        options: {
            "managerid": null,
            "data": "preview",
            "lat_field": "latitude",
            "lon_field": "longitude",
            "count_field": "count",
            "zoom_level": 9, // Can range from 0-9 or max
            "height": 800,
            "spin_speed": 0
        },
        output_mode: "json",
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
            // What does this do?
            //this.settings.enablePush("value");
            // in the case that any options are changed, it will dynamically update
            // without having to refresh. copy the following line for whichever field
            // you'd like dynamic updating on
            this.settings.on("change:lat_field",   this.render, this);
            this.settings.on("change:lon_field",   this.render, this);
            this.settings.on("change:count_field", this.render, this);
            // Set up resize callback. The first argument is a this
            // pointer which gets passed into the callback event
            //$(window).resize(this, _.debounce(this._handleResize, 20));
        },
        //_handleResize: function(e) {
        //    // e.data is the this pointer passed to the callback.
        //    // here it refers to this object and we call render()
        //    e.data.render();
        //},
        createView: function() {
            var that = this;
            var height = parseInt(this.settings.get("height") || that.$el.height());
            var spin_speed = parseFloat(this.settings.get("spin_speed"));

            // clearing all prior junk from the view (eg. 'waiting for data...')
            that.$el.html("");

            that.$el.css({
                "color": "rgb(0, 0, 0)",
                "height": height
            });

            if(!Detector.webgl){
                Detector.addGetWebGLMessage();
            } else {
                return new DAT.Globe(that.el, {
                    imgDir: SplunkUtil.make_url("/static/app/hobbes3_globe") + '/',
                    spin_speed: spin_speed
                });
            }
        },
        // making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            var that = this;
            // getting settings
            var lat_field   = that.settings.get('lat_field');
            var lon_field   = that.settings.get('lon_field');
            var count_field = that.settings.get('count_field');
            var zoom_level  = that.settings.get('zoom_level');

            if(zoom_level === "max") {
                zoom_level = _(data)
                    .chain()
                    .pluck("geobin")
                    .map(function (v) {
                        return /bin_id_zl_(\d)/.exec(v)[1];
                    })
                    .max()
                    .value();
            }

            var filtered_data = _(data)
                .filter(function(row) {
                    var re = new RegExp("bin_id_zl_" + zoom_level);
                    return row.geobin.match(re);
                });

            var max_value = 0;

            var feathered_data = _.chain(filtered_data)
                .groupBy(function(point) {
                    return Math.floor(point.latitude) + "," + Math.floor(point.longitude);
                })
                .map(function(points, coord) {
                    var re = /([^,]+),(.+)/;
                    var lat = parseFloat(re.exec(coord)[1]);
                    var lon = parseFloat(re.exec(coord)[2]);

                    var value = _(points)
                        .chain()
                        .pluck("count")
                        .reduce(function(memo, num) {
                            var sum = parseInt(memo) + parseInt(num);

                            return sum;
                        }, 0)
                        .value();

                    max_value = Math.max(max_value, value);

                    return [lat, lon, value];
                })
                .flatten()
                .value();

            var normalized_feathered_data = _(feathered_data).map(function(v, i) {
                if((i + 1) % 3 === 0) {
                    // Normalized value between 0 and 1
                    v = v / max_value;
                }

                return v;
            });

            return normalized_feathered_data;
        },
        updateView: function(globe, data) {
            TWEEN.start();
            globe.addData(data, {format: 'magnitude', name: 'results', animated: false});
            globe.createPoints();
            globe.animate();
        },
        render: function () {
            this.$el.height(this.settings.get('height'));
            return SimpleSplunkView.prototype.render.call(this);
        }
    });
    return Globe;
});
