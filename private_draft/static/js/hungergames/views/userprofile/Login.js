define(
	[
		"../Modal",
		"$",
		"../../templates/login-options"
	],

	function (Modal, $, template) {

		"use strict";

		return Modal.extend({


			loadComplete : function () {
				this.sup();
				var links = {
						facebookLogin : "/login/facebook/",
						twitterLogin : "/login/twitter/",
					},
					markup = template(links);

				$(".modal").html(markup);
				this.sup();
			}
		});
	}
);
