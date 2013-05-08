/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="intro-animation">\n	<figure>\n		<div>\n			<div class="left"></div>\n			<div class="progress">\n				<ul>\n					<li></li>\n					<li></li>\n					<li></li>\n					<li></li>\n					<li></li>\n				</ul>\n			<h6>';
        if (stack1 = helpers.message) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.message;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</h6>\n			<span class="stand-by-txt">Please Stand By</span>\n			</div>\n			<div class="right"></div>\n		</div>\n		<div>\n			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="335px">\n			     <defs>\n					<linearGradient id="textgradient" x1="0%" x2="100%" y1="0%" y2="0%">\n						<stop stop-color="#aa6815"offset="0%"/>\n						<stop stop-color="#e4a04c"offset="45%"/>\n						<stop stop-color="#e4a04c"offset="55%"/>\n						<stop stop-color="#aa6815"offset="100%"/>\n					</linearGradient>\n					<filter id="innershadow" x0="-50%" y0="-50%" width="200%" height="200%">\n						<!-- <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/> -->\n						<feOffset dy="1" dx="0"/>\n						<feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>\n						<feFlood flood-color="white" flood-opacity="0.25"/>\n						<feComposite in2="shadowDiff" operator="in"/>\n						<feComposite in2="SourceGraphic" operator="over"/>\n					</filter>\n				</defs>\n				<path id="flame" fill="url(#textgradient)" style="filter:url(#innershadow)" d="M12.399-0.083c0,0-4.526,2.442-4.391,7.328c0.135,4.885,1.959,6.174,1.824,11.941c0,0,0,3.731-1.352,2.578\n		c0,0-1.148,0.339-1.351-1.696c0,0-0.675-3.257-2.296-4.139c0,0,0.067,3.903-1.757,6.056c-1.824,2.153-6.147,16.333,0,21.218\n		c0,0,3.866,2.714,8.621,2.714c4.755,0,12.251-4.817,11.948-9.499c0,0,2.197-9.906-6.518-21.372\n		C8.413,3.581,11.656,2.902,12.399-0.083z"/>\n				<text id="h1" x="40"  y="14" fill="url(#textgradient)" style="filter:url(#innershadow)" >THE HUNGER GAMES</text>\n				<text id="h2" x="35"  y="45" fill="url(#textgradient)" style="filter:url(#innershadow)">EXPLORER</text>\n			</svg>\n			<img src="';
        if (stack1 = helpers.STATIC_URL) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.STATIC_URL;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + 'img/loader-glitch.png" />\n		<div>\n	</figure>\n</div>\n';
        return buffer;
    });
});
