// Treemap D3.js code taken and modified from http://bl.ocks.org/mbostock/4063582
//
define(function(require, exports, module) {
    var d3 = require("../d3/d3");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    var _ = require("underscore");
    require("css!./treemap.css");

    var TreeMap= SimpleSplunkView.extend({
        className: "splunk-toolkit-treemap",
        options: {
            "managerid": null,
            "data": "preview",
            "root_label": "Index",
        },
        output_mode: "json",
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);

            $(window).resize(this, _.debounce(this._handleResize, 20));
        },
        _handleResize: function(e) {
            // e.data is the this pointer passed to the callback.
            // here it refers to this object and we call render()
            e.data.render();
        },
        createView: function() {
            this.$el.html("");
            return true;
        },

        // Making the data look how we want it to for updateView to do its job
        formatData: function(data) {
         
          // Convert the string value to number
          data = _(data).map(function(f){
            f.count = parseInt(f.count)
            return f
          });
          
          var nestingKeys = Object.keys(data[0]).slice(0, -1);
          var nestedData = d3.nest();

          nestingKeys.forEach(function(k) {
            nestedData.key(function(d) {return d[k]; })
          });

          var nest = {
            "key" : "root",
            "values": nestedData.entries(data)
          };
          return nest;
        },

        updateView: function(viz, data) {
          
          var w = 600,
              h = 400,
              x = d3.scale.linear().range([0, w]),
              y = d3.scale.linear().range([0, h]),
              color = d3.scale.category20c(),
              root,
              node;

          var treemap = d3.layout.treemap()
              .round(false)
              .size([w, h])
              .sticky(true)
              .value(function(d) { return d.count; })
              .children(function(d){return d.values});

          var svg = d3.select(this.el).append("div")
              .attr("class", "chart")
              .style("width", w + "px")
              .style("height", h + "px")
            .append("svg:svg")
              .attr("width", w)
              .attr("height", h)
            .append("svg:g")
              .attr("transform", "translate(.5,.5)");


          node = root = data;

          var nodes = treemap.nodes(root)
              .filter(function(d) { return !d.values; });

          var cell = svg.selectAll("g")
              .data(nodes)
            .enter().append("svg:g")
              .attr("class", "cell")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

          cell.append("svg:rect")
              .attr("width", function(d) { return d.dx - 1; })
              .attr("height", function(d) { return d.dy - 1; })
              .style("fill", function(d) { console.log(d); return color(d.parent.key); });

          cell.append("svg:text")
              .attr("x", function(d) { return d.dx / 2; })
              .attr("y", function(d) { return d.dy / 2; })
              .attr("dy", ".35em")
              .attr("text-anchor", "middle")
              .text(function(d) { return d.parent.key; })
              .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

          d3.select(window).on("click", function() { zoom(root); });

          d3.select("select").on("change", function() {
            treemap.value(this.value == "size" ? size : count).nodes(root);
            zoom(node);
          });


          function size(d) {
            return d.count;
          }

          function count(d) {
            return 1;
          }

          function zoom(d) {
            var kx = w / d.dx, ky = h / d.dy;
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

            var t = svg.selectAll("g.cell").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

            t.select("rect")
                .attr("width", function(d) { return kx * d.dx - 1; })
                .attr("height", function(d) { return ky * d.dy - 1; })

            t.select("text")
                .attr("x", function(d) { return kx * d.dx / 2; })
                .attr("y", function(d) { return ky * d.dy / 2; })
                .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

            node = d;
            d3.event.stopPropagation();
          }
        }
    });
    return TreeMap;
});
