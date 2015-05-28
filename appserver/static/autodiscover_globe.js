require.config({
    paths: {
        "app": "../app",
        "three": "../app/custom_vizs/components/globe/three.min"
    },
    shims: {
        "three": {
            "exports": "THREE"
        }
    }
});

require(['splunkjs/mvc/simplexml/ready!'], function() {
    require(['splunkjs/ready!'], function() {
        // The splunkjs/ready loader script will automatically instantiate all elements
        // declared in the dashboard's HTML.
    });
});
