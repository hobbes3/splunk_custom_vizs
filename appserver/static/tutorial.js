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

    var search = "search index=_internal | head 1";

    service.oneshotSearch(search, {}, function(err, results) {
        if(results.rows.length === 0) {
            alert(
                'WARNING! You don\`t have the ability to search Splunk\`s internal log so some examples will not work.\n\n' +
                'Get a role (ie admin) that can search internal log or use this app on another Splunk instance (ie dev box).'
            );
        }
    });
});
