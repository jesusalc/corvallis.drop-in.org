define(
	[
		"rosy/modules/Module",
		"$"
	],

	function (Module, $) {

		"use strict";

		var Share = Module.extend({
			init : function () {
				$(document).on('click', '.share-button, [data-popup="true"]', this.share);
			},

			share : function (e) {
				var href = $(e.currentTarget).attr('href'),
					left = e.screenX - 300,
					top = e.screenY - 100,
					settings = "width=600,height=350,left=" + left + ",top=" + top + ",toolbar=0,location=1,scrollbars=1";
				window.open(href, 'hgeshare', settings);
				return false;
			}
		});

		return new Share();
	}
);
