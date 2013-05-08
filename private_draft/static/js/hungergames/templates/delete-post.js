/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        return '<div class="content delete-post">\n	<h3 class="title">Delete Post</h3>\n	<div class="close" data-close="true"><span class="icon-close"></div>\n	<form class="form" action="/">\n		<h4>Are you sure you want to delete this post?</h4>\n		<div>\n			<button class="cancel">No</button>\n		</div>\n		<div>\n			<button class="confirm">Yes</button>\n		</div>\n	</form>\n</div>';
    });
});
