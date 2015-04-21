require.config({
    paths: {
        "app": "../app",
        "tween": "../app/hobbes3_globe/Tween",
        "three": "../app/hobbes3_globe/three.min",
        "detector": "../app/hobbes3_globe/Detector",
        "globe": "../app/hobbes3_globe/globe"
    },
    shims: {
        "tween": {
            "exports": "TWEEN"
        },
        "three": {
            "exports": "THREE"
        },
        "detector": {
            "exports": "Detector"
        },
        "globe": {
            "deps": ["three"],
            "exports": "DAT"
        }
    }
});

require(['splunkjs/mvc/simplexml/ready!'], function(){
    require(['splunkjs/ready!'], function(){
        // The splunkjs/ready loader script will automatically instantiate all elements
        // declared in the dashboard's HTML.
    });
});
