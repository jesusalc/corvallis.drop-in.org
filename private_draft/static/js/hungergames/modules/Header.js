define(
	[
		"rosy/modules/Module",
		"$",
		"lodash"
	],

	function (Module, $, lodash) {

		"use strict";

		var win = $(window),
			viewport = $('meta[name="viewport"]');


		return Module.extend({

			mobileView : false,
			minWidth : 640,

			init : function () {
				win.scrollTop(win.scrollTop() + 1); // remove url bar in iOS
				this.addListeners();
				this.onResize();
			},

			onResizeDebounce : null,
			onResize : function (e) {
				var w = win.width();
				if (w <= this.minWidth && !this.mobileView) { // zoom
					this.mobileView = true;
					viewport.replaceWith('<meta name="viewport" content="width=device-width, initial-scale=.7, maximum-scale=.7" />');
				} else if (w > this.minWidth && this.mobileView) {
					this.mobileView = false;
					viewport.replaceWith('<meta name="viewport" content="width=device-width, initial-scale=1" />');
				}
			},

			addListeners : function () {
				this.onResizeDebounce = lodash.debounce(this.onResize, 20);
				win.on("resize", $.proxy(this.onResizeDebounce, this));
			},

			removeListeners : function () {
				win.off("resize", $.proxy(this.onResizeDebounce, this));
			},

			destroy : function () {
				this.removeListeners();
			}

		});
	}
);
