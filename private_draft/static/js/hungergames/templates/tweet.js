/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, options, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing;
        buffer += '<div class="left">\n	<a href="http://twitter.com/' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.screen_name), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank">\n		<img src="' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.profile_image_url), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" alt="' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.name), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" />\n	</a>\n</div>\n<div class="right">\n	<h4>\n		<a href="http://twitter.com/' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.screen_name), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank">\n			' + escapeExpression((stack1 = (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.name), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '\n		</a>\n		<span class="screenname">';
        options = {
            hash: {},
            data: data
        };
        buffer += escapeExpression((stack1 = helpers.linkTwitterUser, stack1 ? stack1.call(depth0, (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.screen_name), options) : helperMissing.call(depth0, "linkTwitterUser", (stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.user), stack1 == null || stack1 === false ? stack1 : stack1.screen_name), options))) + '</span>\n		<span class="date">';
        options = {
            hash: {},
            data: data
        };
        buffer += escapeExpression((stack1 = helpers.parseTwitterDate, stack1 ? stack1.call(depth0, depth0.tweet, options) : helperMissing.call(depth0, "parseTwitterDate", depth0.tweet, options))) + "</span>\n	</h4>\n	<p>\n		";
        options = {
            hash: {},
            data: data
        };
        buffer += escapeExpression((stack1 = helpers.parseTweet, stack1 ? stack1.call(depth0, depth0.tweet, options) : helperMissing.call(depth0, "parseTweet", depth0.tweet, options))) + '\n	</p>\n\n	<ul class="actions">\n		<li class="reply"><a href="https://twitter.com/intent/tweet?in_reply_to=' + escapeExpression((stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.id_str), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank">Reply</a></p>\n		<li class="retweet"><a href="https://twitter.com/intent/retweet?tweet_id=' + escapeExpression((stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.id_str), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank">Retweet</a></p>\n		<li class="favorite"><a href="https://twitter.com/intent/favorite?tweet_id=' + escapeExpression((stack1 = (stack1 = depth0.tweet, stack1 == null || stack1 === false ? stack1 : stack1.id_str), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank">Favorite</a>\n	</ul>\n</div>\n\n<div class="frame-tr"></div>\n<div class="frame-tl"></div>\n<div class="frame-br"></div>\n<div class="frame-bl"></div>\n';
        return buffer;
    });
});
