define(
	[
		"rosy/modules/Module",
		"rosy/modules/scrollBox/ScrollBox",
		"./template",
		"./data",
		"$"
	],

	function (Module, ScrollBox, template, data, $) {

		"use strict";

		return Module.extend({

			$nav : null,
			scrollbox : null,
			isNav : false,

			init : function () {
				this.$nav = $("#thgn-nav");

				data.updateRegion(data.tier1);

				this.$nav.html(template(data));

				this.scrollbox = new ScrollBox(".thgn-nav-list", {
					mousewheel : true,
					container : "#thgn-nav",
					touch : true,
					scrollbar : false,
					bubble : false,
					stepSize : 232
				});

				$(document).on('click', '.thgn-districts', function () {
					$(this).addClass('active');
				});

				$(document).on('click', '#thgn-nav-trigger', $.proxy(this.toggleNav, this));

				$(".btn-thgn-up").on("click", this.scrollbox.next);
				$(".btn-thgn-down").on("click", this.scrollbox.prev);

			},

			toggleNav : function (e) {

				this.isOn = !this.isOn;

				this.$nav.toggleClass('active', this.isOn);

				$(document).off('click', this.onCloseNav);

				if (this.isOn) {

					this.publish("track.event", {
						category : "The Hunger Games Network Nav",
						action : "Open",
						label : "Open",
						value : 1
					});

					$(document).on('click', this.onCloseNav);
				}
			},

			onCloseNav : function (e) {
				var targ = $(e.target);

				if (!targ.parents("#thgn-nav").length) {
					this.isOn = false;
					this.$nav.toggleClass('active', this.isOn);

					$(document).off('click', this.onCloseNav);
				}
			},
		});
	}
);
