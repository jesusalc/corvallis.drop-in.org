/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n		";
            stack1 = helpers.each.call(depth0, depth0.original_images, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n	";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, stack2;
            buffer += '\n			<figure class="' + escapeExpression((stack1 = depth0.aspect_ratio, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">\n				<img src="' + escapeExpression((stack1 = depth0.url, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" alt="' + escapeExpression((stack1 = depth0.caption, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" />\n			</figure>\n			';
            stack2 = helpers["if"].call(depth0, depth0.caption, {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\n		";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n				<figcaption>" + escapeExpression((stack1 = depth0.caption, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</figcaption>\n			";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n		<figure class="';
            if (stack1 = helpers.aspect_ratio) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.aspect_ratio;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\n			<img src="';
            if (stack1 = helpers.image_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.image_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" alt="';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" />\n		</figure>\n	';
            return buffer;
        }
        function program7(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n		<h1 class="title"><a href="';
            if (stack1 = helpers.post_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" target="_blank">';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</a></h1>\n	";
            return buffer;
        }
        function program9(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n		<div class="twitter-actions">\n			<a class="time icon-twitter" href="';
            if (stack1 = helpers.post_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" target="_blank">';
            if (stack1 = helpers.timeago) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.timeago;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</a>\n			<a data-popup="true" class="icon-star" href="https://twitter.com/intent/favorite?tweet_id=';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-track-social="Twitter" data-event-action="Favorite" data-event-target="';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '"></a>\n			<a data-popup="true" class="icon-retweet" href="https://twitter.com/intent/retweet?tweet_id=';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-track-social="Twitter" data-event-action="Retweet" data-event-target="';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '"></a>\n			<a data-popup="true" class="icon-reply" href="https://twitter.com/intent/tweet?in_reply_to=';
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
            buffer += escapeExpression(stack1) + '" data-track-social="Twitter" data-event-action="Reply" data-event-target="';
            if (stack1 = helpers.post_id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.post_id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '"></a>\n		</div>\n	';
            return buffer;
        }
        buffer += '<div class="body">\n	';
        stack1 = helpers["if"].call(depth0, depth0.is_photoset, {
            hash: {},
            inverse: self.program(5, program5, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n	";
        stack1 = helpers["if"].call(depth0, depth0.title, {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n	";
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
        buffer += "\n	";
        stack1 = helpers["if"].call(depth0, depth0.is_twitter, {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n</div>\n";
        return buffer;
    });
});
