/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return 'checked="checked" ';
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            buffer += 'value="';
            if (stack1 = helpers.dateOfBirth) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.dateOfBirth;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" ';
            return buffer;
        }
        buffer += '<div class="content edit-profile two-col">\n	<div class="wrapper">\n		<div class="edit">\n			<h3 class="title">Edit your profile</h3>\n			<div class="close" data-close="true"><span class="icon-close"></div>\n			 <form class="form" enctype="multipart/form-data" action="/citizenship/update_profile/?next=/profile" method="post">\n			 	<input type="hidden" name="csrfmiddlewaretoken" value="';
        if (stack1 = helpers.token) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.token;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\n			 	<div class="left">\n					<input type="email" name="email" placeholder="Email Address" value="';
        if (stack1 = helpers.email) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.email;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" />\n					 <div class="avatar">\n		                <div class="placeholder"><img id="uploadPreview" src="';
        if (stack1 = helpers.imgURL) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.imgURL;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" width="60" height="60" alt="your image"/></div>\n		                <div class="button">\n		                    Upload New Photo\n		                    <input id="id_pic" name="pic" type="file" accept="image/*" />\n		                </div>\n		                <h5>Max file size: 1MB</h5>\n		            </div>\n					<div class="gender">\n		                <h4>Gender:</h4>\n		                <label>\n		                    <input type="radio" name="gender" value="m" ';
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.gender, stack1 == null || stack1 === false ? stack1 : stack1.isMale), {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '/>\n		                    <span></span>\n		                    Male\n		                </label>\n		                <label>\n		                    <input type="radio" name="gender" value="f" ';
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.gender, stack1 == null || stack1 === false ? stack1 : stack1.isFemale), {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '/>\n		                    <span></span>\n		                    Female\n		                </label>\n		                <label>\n		                    <input type="radio" name="gender" value="u" ';
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.gender, stack1 == null || stack1 === false ? stack1 : stack1.isUnknown), {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '/>\n		                    <span></span>\n		                    Unknown\n		                </label>\n		            </div>\n		        </div>\n		        <div class="right">\n					<div>\n		                <!-- <h4>Date of birth:<span> (MM/DD/YYYY)</span></h4> -->\n		                <input id="id_dob" type="text" name="dob" placeholder="Date of birth:MM/DD/YYYY" ';
        stack2 = helpers["if"].call(depth0, depth0.dateOfBirth, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '/>\n		            </div>\n					<div>\n		               <!--  <h4>Location:</h4> -->\n		                <input id="id_location" type="text" name="location" class="city" value="';
        if (stack2 = helpers.location) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.location;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '"/>\n		                <input id="id_country" type="text" name="country" placeholder="Country" value="';
        if (stack2 = helpers.country) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.country;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '" class="country"/>\n		            </div>\n					<input type="tel" name="mobile_number" placeholder="Mobile Phone #" value="';
        if (stack2 = helpers.phoneNumber) {
            stack2 = stack2.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack2 = depth0.phoneNumber;
            stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
        }
        buffer += escapeExpression(stack2) + '" />\n					<div class="notifications">\n		                <label>\n		                    <input name="receive_emails" type="checkbox" ';
        stack2 = helpers["if"].call(depth0, depth0.emailList, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '/>\n		                    <span></span>\n		                    Email me with notifications\n		                </label>\n		            </div>\n		        </div>\n				<button>Done</button>\n				<!-- <a href="#deactivate" class="deactivate">Deactivate Account</a> -->\n			</form>\n		</div>\n		<div class="deactivate-confirm">\n			<h3 class="title">Deactivate Your Account</h3>\n			<form class="form" action="/">\n				<h4>Are you sure you want to deactivate your account?</h4>\n				<div>\n					<button class="cancel">No</button>\n				</div>\n				<div>\n					<button class="confirm">Yes</button>\n				</div>\n			</form>\n		</div>\n	</div>\n</div>';
        return buffer;
    });
});
