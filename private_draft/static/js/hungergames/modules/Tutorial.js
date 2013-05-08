define(
	[
		"../views/Modal",
		"$",
		"../Config",
		"../templates/tutorial",
	],

	function (Modal, $, Config, template) {

		"use strict";

		return Modal.extend({

			clickTargets : null,

			init : function () {
				this.clickTargets = $('.modal, .blackout');
			},

			load : function () {
				$(".modal").addClass("tutorial").html(template({}));
				this.clickTargets = $('.modal, .blackout');
				this.clickTargets.on('click', this.nextFrame);
				this.loadComplete();
			},

			nextFrame : function () {
				var tabs = $(".modal .content");
				if (!tabs.is('.next')) {
					tabs.addClass('next');
				} else {
					$('.modal').removeClass("tutorial");
					this.publish("closeModal", {});
					this.clickTargets.off('click', this.nextFrame);
				}
			}
		});
	}
);
