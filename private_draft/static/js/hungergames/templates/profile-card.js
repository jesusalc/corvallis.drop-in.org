/*jshint boss:true, white:false*/
define([ "handlebars" ], function(Handlebars) {
    return Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 2, ">= 1.0.0-rc.3" ];
        helpers = helpers || Handlebars.helpers;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '\n	<svg id="dip-card" width="452px" height="288px" viewBox="0 0 452 288" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">\n	    <g>\n	        <clipPath id="myMask">\n	           <path d="M425,288c-136.666,0-273.333,0-410,0c-7.452-2.039-12.147-7.032-15-14c0-86.334,0-172.667,0-259\n				C2.218,7.218,7.275,2.275,15,0c140.667,0,281.334,0,422,0c7.711,2.289,12.727,7.273,15,15c0,82,0,164,0,246\n				C443,270,434,279,425,288z"/>\n	        </clipPath>\n	    </g>\n	    <!-- Xlink:href is going to turn into one big ugly set of if/else conditionals based on 12 districts and 3 different roles... -->\n	    <image id="card-bg" clip-path="url(#myMask)" xlink:href="';
        if (stack1 = helpers.backgroundImg) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.backgroundImg;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '"  width="486" height="324" x="-17px" y="-18px" />\n	</svg>\n\n	<img src="';
        if (stack1 = helpers.imgURL) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.imgURL;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" />\n	<div class="user-info">\n		<div class="name">';
        if (stack1 = helpers.name) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.name;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</div>\n\n		<div class="dob">\n			<p class="label">Date of birth:</p>\n			<p>';
        if (stack1 = helpers.dateOfBirth) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.dateOfBirth;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</p>\n		</div>\n\n		<div class="gender">\n			<p class="label">Gender:</p>\n			<p>';
        if (stack1 = helpers.gender) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.gender;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</p>\n		</div>\n\n		<div class="location">\n			<p class="label">Migrated from:</p>\n			<p>';
        if (stack1 = helpers.location) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.location;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</p>\n		</div>\n\n		<div class="country">\n			<p class="label">Country:</p>\n			<p>';
        if (stack1 = helpers.country) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.country;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</p>\n		</div>\n\n		<div class="occupation">\n			<p class="label">Assigned Occupation:</p>\n			<p>';
        if (stack1 = helpers.occupation) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.occupation;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</p>\n		</div>\n\n		<div class="pcn">\n			<p class="label">Panem Citizen Number [PCN]</p>\n			<p>';
        if (stack1 = helpers.pcn) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.pcn;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</p>\n		</div>\n	</div>\n\n	<a href="/en/profile/#/pass-generator" class="icon-card">Download Your District Identification Pass</a>\n\n';
        return buffer;
    });
});
