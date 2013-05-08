/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n		<a class="avatar" target="_blank" href="';
            if (stack1 = helpers.poster_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" style="background-image:url(';
            if (stack1 = helpers.avatar_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.avatar_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ')"></a>\n		<a target="_blank" href="';
            if (stack1 = helpers.poster_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">@';
            if (stack1 = helpers.poster_sn) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_sn;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</a>\n		<a target="_blank" href="';
            if (stack1 = helpers.poster_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">';
            stack1 = helpers["if"].call(depth0, depth0.poster_name, {
                hash: {},
                inverse: self.program(4, program4, data),
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\n	";
            return buffer;
        }
        function program2(depth0, data) {
            var stack1;
            if (stack1 = helpers.poster_name) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_name;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            return escapeExpression(stack1);
        }
        function program4(depth0, data) {
            var stack1;
            if (stack1 = helpers.poster_sn) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_sn;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            return escapeExpression(stack1);
        }
        function program6(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n		<i class="avatar" style="background-image:url(';
            if (stack1 = helpers.avatar_url) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.avatar_url;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ')"></i>\n		<b>';
            if (stack1 = helpers.poster_sn) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.poster_sn;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</b>\n	";
            return buffer;
        }
        function program8(depth0, data) {
            return " active";
        }
        function program10(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n	<div data-primary-key="';
            if (stack1 = helpers.primary_key) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.primary_key;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-network="';
            if (stack1 = helpers.network) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.network;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" class="delete"><span class="icon-close"></span></div>\n	';
            return buffer;
        }
        buffer += '<div class="author">\n	';
        stack1 = helpers["if"].call(depth0, depth0.is_twitter, {
            hash: {},
            inverse: self.program(6, program6, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n	<div data-primary-key="';
        if (stack1 = helpers.primary_key) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.primary_key;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" data-network="';
        if (stack1 = helpers.network) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.network;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" class="spark';
        stack1 = helpers["if"].call(depth0, depth0.is_sparked, {
            hash: {},
            inverse: self.noop,
            fn: self.program(8, program8, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '">';
        if (stack1 = helpers.total_sparks_display) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.total_sparks_display;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + "</div>\n	";
        stack1 = helpers["if"].call(depth0, depth0.can_edit, {
            hash: {},
            inverse: self.noop,
            fn: self.program(10, program10, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n</div>\n";
        return buffer;
    });
});
