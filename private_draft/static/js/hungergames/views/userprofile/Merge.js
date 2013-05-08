define(
	[
		"../Modal",
		"$",
		"../../templates/profile-merge"
	],

	function (Modal, $, template) {

		"use strict";

		return Modal.extend({


			loadComplete : function () {
				this.sup();

				var markup = template({});

				$(".modal").html(markup);

				// $('.blackout, .modal').show();
				this.sup();

				$("button").click(this.validate);

			},

			validate : function (e) {
				e.preventDefault();

				$("form").submit();
			}
		});
	}
);
