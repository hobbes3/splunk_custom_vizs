require.config({
    paths: {
        "app": "../app"
    }
});

require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function(
    $,
    _,
    mvc
) {
    require(['splunkjs/ready!'], function() {
        function submit_and_update_url() {
            submitted_tokens.set(unsubmitted_tokens.toJSON());
            mvc.Components.get('url').saveOnlyWithPrefix('form\\.', unsubmitted_tokens.toJSON(), {
                replaceState: false
            });
        }

        $("#field1").hide();

        var unsubmitted_tokens = mvc.Components.get('default');
        var submitted_tokens = mvc.Components.get('submitted');

        var chordchart     = mvc.Components.get("chordchart");
        var from_timechart = mvc.Components.get("from_timechart");
        var from_pie_chart = mvc.Components.get("from_pie_chart");
        var to_timechart   = mvc.Components.get("to_timechart");
        var to_pie_chart   = mvc.Components.get("to_pie_chart");

        // Set the width of the div otherwise the centering ("margin: 0 auto" in the CSS) won't work
        chordchart.$el.css("width", chordchart.options.width);

        chordchart.on("click", function(city_name) {
            unsubmitted_tokens.set("form.selected_city", city_name);
            submit_and_update_url();
        });

        chordchart.on("colors_ready", function() {
            var src_colors = chordchart.options.src_colors;
            // From {"Belgium":"#ff0000"} to {"Belgium":0xff0000}
            // Because SimpleXML only takes the latter format
            field_colors = JSON.stringify(src_colors).replace(/:"#/g, ":0x").replace(/(0x\w{6})"/g, "$1");

            var drilldown_panels = [from_timechart, from_pie_chart, to_timechart, to_pie_chart];

            $.each(drilldown_panels, function() {
                this.getVisualization(function(viz) {
                    viz.settings.set("charting.fieldColors", field_colors);
                });
            });
        });
    });
});
