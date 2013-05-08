/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="content login">\n	<h3 class="title">Login Required</h3>\n	<div class="close" data-close="true"><span class="icon-close"></div>\n	<div>\n		<h4>You can login via one of the following services:</h4>\n	    <div class="options">\n	    	<ul>\n		    	<li><a class="icon-facebook" href="';
        if (stack1 = helpers.facebookLogin) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.facebookLogin;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">Facebook</a></li>\n				<li><a class="icon-twitter" href="';
        if (stack1 = helpers.twitterLogin) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.twitterLogin;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">Twitter</a></li>\n	    	</ul>\n		</div>\n	</div>\n</div>';
        return buffer;
    });
});
