require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
],
function(
    $,
    _,
    mvc
) {
    var service = mvc.createService();

    if(service.app !== "custom_vizs") {
        alert(
            'WARNING! Your app name is not "custom_vizs" so all the dashboads will probably not work.\n\n' +
            'Rename the app (folder name) to "custom_vizs" and restart Splunk.'
        );
    }
});
