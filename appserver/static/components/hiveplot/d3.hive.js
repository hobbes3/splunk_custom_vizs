define(function(require, exports, module) {
var d3 = require("../d3/d3");

/// BEGIN LIBRARY CODE

d3.hive={},d3.hive.link=function(){function t(t,s){var u,h=a(r,this,t,s),i=a(n,this,t,s);h.a>i.a&&(u=i,i=h,h=u),i.a-h.a>Math.PI&&(h.a+=2*Math.PI);var e=h.a+(i.a-h.a)/3,c=i.a-(i.a-h.a)/3;return h.r0-h.r1||i.r0-i.r1?"M"+Math.cos(h.a)*h.r0+","+Math.sin(h.a)*h.r0+"L"+Math.cos(h.a)*h.r1+","+Math.sin(h.a)*h.r1+"C"+Math.cos(e)*h.r1+","+Math.sin(e)*h.r1+" "+Math.cos(c)*i.r1+","+Math.sin(c)*i.r1+" "+Math.cos(i.a)*i.r1+","+Math.sin(i.a)*i.r1+"L"+Math.cos(i.a)*i.r0+","+Math.sin(i.a)*i.r0+"C"+Math.cos(c)*i.r0+","+Math.sin(c)*i.r0+" "+Math.cos(e)*h.r0+","+Math.sin(e)*h.r0+" "+Math.cos(h.a)*h.r0+","+Math.sin(h.a)*h.r0:"M"+Math.cos(h.a)*h.r0+","+Math.sin(h.a)*h.r0+"C"+Math.cos(e)*h.r1+","+Math.sin(e)*h.r1+" "+Math.cos(c)*i.r1+","+Math.sin(c)*i.r1+" "+Math.cos(i.a)*i.r1+","+Math.sin(i.a)*i.r1}function a(t,a,r,n){var e=t.call(a,r,n),c=+("function"==typeof s?s.call(a,e,n):s)+i,o=+("function"==typeof u?u.call(a,e,n):u),M=u===h?o:+("function"==typeof h?h.call(a,e,n):h);return{r0:o,r1:M,a:c}}var r=function(t){return t.source},n=function(t){return t.target},s=function(t){return t.angle},u=function(t){return t.radius},h=u,i=-Math.PI/2;return t.source=function(a){return arguments.length?(r=a,t):r},t.target=function(a){return arguments.length?(n=a,t):n},t.angle=function(a){return arguments.length?(s=a,t):s},t.radius=function(a){return arguments.length?(u=h=a,t):u},t.startRadius=function(a){return arguments.length?(u=a,t):u},t.endRadius=function(a){return arguments.length?(h=a,t):h},t};

/// END LIBRARY CODE

return d3.hive;

});
