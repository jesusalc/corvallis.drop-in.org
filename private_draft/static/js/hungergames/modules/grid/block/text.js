/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n	<div class="actions">\n		<a class="time icon-twitter" target="_blank" href="';
            if (stack1 = helpers.post_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            if (stack1 = helpers.timeago) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.timeago;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</a>\n		<a data-popup="true" class="icon-star" href="https://twitter.com/intent/favorite?tweet_id=';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '"></a>\n		<a data-popup="true" class="icon-retweet" href="https://twitter.com/intent/retweet?tweet_id=';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '"></a>\n		<a data-popup="true" class="icon-reply" href="https://twitter.com/intent/tweet?in_reply_to=';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "&url=";
            if (stack1 = helpers.absolute_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.absolute_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '"></a>\n	</div>\n';
            return buffer;
        }
        function program3(depth0, data) {
            return '\n	<div class="frame-tr"></div>\n	<div class="frame-tl"></div>\n	<div class="frame-br"></div>\n	<div class="frame-bl"></div>\n';
        }
        buffer += "<blockquote>";
        if (stack1 = helpers.body) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.body;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "</blockquote>\n";
        stack1 = helpers["if"].call(depth0, depth0.is_twitter, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n";
        stack1 = helpers["if"].call(depth0, depth0.has_frame, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n";
        return buffer;
    });
});
