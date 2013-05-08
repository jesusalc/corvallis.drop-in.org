/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        return '<div class="content">\n	<h3 class="title">Merge Accounts</h3>\n	<div class="close" data-close="true"><span class="icon-close"></div>\n	<form class="form merge" action="/">\n		<h4>Which profile do you want to keep? Select one of your profiles and the other\'s Posts and Sparks will be merged into that account.</h4>\n		<label>\n			<input type="radio" name="profile" value="1" checked="checked"/>\n			<div class="avatar selected">\n				<img src="http://placehold.it/50x50">\n				<h2>UserName 1</h2>\n				<h4>Citizen of District 12</h4>\n			</div>\n		</label>\n		<label>\n			<input type="radio" name="profile" value="2" />\n			<div class="avatar selected">\n				<img src="http://placehold.it/50x50">\n				<h2>Thisisareallylongusername </h2>\n				<h4>Citizen of District 7</h4>\n			</div>\n		</label>\n		<button class="edit">Done</button>\n	</form>\n</div>';
    });
});
