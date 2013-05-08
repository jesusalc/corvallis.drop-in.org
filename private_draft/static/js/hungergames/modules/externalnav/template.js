/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n				<a href="' + escapeExpression((stack1 = depth0.href, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="' + escapeExpression((stack1 = depth0.target, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" class="thgn-btns thgn-icon-' + escapeExpression((stack1 = depth0.id, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" data-category="The Hunger Games Network Nav" data-action="Click" data-label="' + escapeExpression((stack1 = depth0.href, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = depth0.title, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</a>\n			";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n				";
            stack1 = helpers["if"].call(depth0, depth0.href1, {
                hash: {},
                inverse: self.program(6, program6, data),
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n			";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n					<div class="thgn-btns-large thgn-icon-' + escapeExpression((stack1 = depth0.id, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">\n						<a href="' + escapeExpression((stack1 = depth0.href1, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank" class="thgn-btns thgn-btns-no-top" data-category="The Hunger Games Network Nav" data-action="Click" data-label="' + escapeExpression((stack1 = depth0.href1, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = depth0.title1, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '</a>\n						<a href="' + escapeExpression((stack1 = depth0.href2, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank" class="thgn-btns thgn-btns-no-bot" data-category="The Hunger Games Network Nav" data-action="Click" data-label="' + escapeExpression((stack1 = depth0.href2, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = depth0.title2, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</a>\n					</div>\n				";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n					";
            stack1 = helpers["if"].call(depth0, depth0.districts, {
                hash: {},
                inverse: self.program(10, program10, data),
                fn: self.program(7, program7, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n				";
            return buffer;
        }
        function program7(depth0, data) {
            var buffer = "", stack1, stack2;
            buffer += '\n						<div class="thgn-districts">\n							<div class="thgn-btns thgn-icon-' + escapeExpression((stack1 = depth0.id, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = depth0.title, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</div>\n							";
            stack2 = helpers.each.call(depth0, depth0.districts, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\n						</div>\n					";
            return buffer;
        }
        function program8(depth0, data) {
            var buffer = "";
            buffer += '\n								<a class="thgn-district thgn-district-' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '" href="https://www.facebook.com/District' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + 'PN" target="_blank" data-category="The Hunger Games Network Nav" data-action="Click" data-label="https://www.facebook.com/District' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + 'PN">' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + "</a>\n							";
            return buffer;
        }
        function program10(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n						<a href="' + escapeExpression((stack1 = depth0.href, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" target="_blank" class="thgn-btns thgn-icon-' + escapeExpression((stack1 = depth0.id, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" data-category="The Hunger Games Network Nav" data-action="Click" data-label="' + escapeExpression((stack1 = depth0.href, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">' + escapeExpression((stack1 = depth0.title, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "</a>\n					";
            return buffer;
        }
        buffer += '<div class="btn-thgn-up"></div>\n<div class="btn-thgn-down"></div>\n<div class="thgn-nav-clip">\n	<div class="thgn-nav-list">\n		<div class="thgn-btnset">\n			';
        stack1 = helpers.each.call(depth0, depth0.tier1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n		</div>\n		<div class="thgn-separator"></div>\n		<div class="thgn-btnset">\n			';
        stack1 = helpers.each.call(depth0, depth0.tier2, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n		</div>\n		<div class="thgn-separator"></div>\n		<div class="thgn-btnset">\n			';
        stack1 = helpers.each.call(depth0, depth0.tier3, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n		</div>\n	</div>\n</div>\n";
        return buffer;
    });
});
