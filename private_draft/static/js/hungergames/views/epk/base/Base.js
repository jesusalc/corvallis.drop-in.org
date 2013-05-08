define(
	[
		"../../Base",
		"$",
		"lodash",
		"$plugin!transit",
		"$plugin!text-gradient"
	],

	function (Base, $, lodash, $transition, $textGradient) {

		"use strict";

		var win = $(window);

		return Base.extend({

			$breadcrumb : null,

			_resize_timer : 0,

			onResizeDebounce : function () {
				if (this._resize_timer) {
					window.clearTimeout(this._resize_timer);
				}

				this._resize_timer = this.setTimeout(this.onResize, 80);
			},

			onResize : function (e) {
				// stub intended for overwrite
			},

			load : function () {
				this.dom = $("#modal");
				this.loadComplete();
			},

			loadComplete : function () {
				// assuming this swaps content
				// this.dom.find("[data-text-gradient]").textGradient(); // convert all to text gradients
				this.$breadcrumb = $(".breadcrumb");
				this.sup();
			},

			addListeners : function () {
				// this.onResizeDebounce = lodash.debounce(this.onResize, 100);
				win.on("resize", $.proxy(this.onResizeDebounce, this));
			},

			removeListeners : function () {
				win.off("resize", $.proxy(this.onResizeDebounce, this));
			},

			transitionIn : function () {
				this.$breadcrumb.transition({
					opacity: 1,
					y : 0,
					easing : "easeOutCirc",
					duration : "350ms"
				});
			}
		});
	}
);
