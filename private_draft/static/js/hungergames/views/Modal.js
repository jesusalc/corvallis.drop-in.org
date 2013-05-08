define(
	[
		"./Base",
		"$",
	],

	function (Base, $) {

		"use strict";

		return Base.extend({


			loadComplete : function () {
				this.sup();

				$('.blackout').show();
				$('.modal').show({duration: 100, complete: function () {
					$(".modal").addClass("show");
				}});

				$(".confirm").click(this.submit);

				$('.modal .close').click(this.closeModal);
			},

			closeModal : function (e) {
				//e.preventDefault();

				this.publish("closeModal", {});
				// override this if you need to do something on close.
			},

			submit : function (e) {
				e.preventDefault();
			},

			handleResponse : function (response) {
				// if response.success
				// User.update(response);

				// if response.error
				//
			},

		});
	}
);
