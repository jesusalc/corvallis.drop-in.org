/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        return '<div class="content">\n	<div class="tut-block">\n		<h3>Explore official and fan generated content</h3>\n		<div class="graphic scroll-grid"></div>\n	</div>\n	<div class="tut-block">\n		<h3>Tap or click to view and share</h3>\n		<div class="graphic tap-or-click"></div>\n	</div>\n	<div class="tut-block tut-block-last">\n		<h3>Drag content using touch or mouse</h3>\n		<div class="graphic drag"></div>\n	</div>\n	<h5>1/2</h5>\n	<a href="#next">Next</a>\n	<div class="tut-block">\n		<h3>Create a profile &amp; get a district i.d.</h3>\n		<div class="graphic create-card"></div>\n	</div>\n	<div class="tut-block">\n		<h3>Spark your favorite content</h3>\n		<div class="graphic spark-posts"></div>\n	</div>\n	<div class="tut-block tut-block-last">\n		<h3>Hashtag your posts to see them on our site</h3>\n		<div class="graphic hashtag"></div>\n	</div>\n	<h5>2/2</h5>\n	<a href="#done">Done</a>\n</div>\n';
    });
});
