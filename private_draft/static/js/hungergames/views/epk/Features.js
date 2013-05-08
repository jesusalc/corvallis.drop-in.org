define(

	[
		"./base/GalleryPage",
		"$",
		"../../Config",
		"swfobject"
	],

	function (GalleryPage, $, Config, swfobject) {

		"use strict";

		return GalleryPage.extend({

			$flash : null,

			flash : {
				src : "",
				id : "",
				flashvars : {},

				params : {
					quality: "high",
					scale : "noborder",
					menu : "false",
					allowScriptAccess : "always",
					bgcolor : "#000000",
					wmode : "transparent"
				},
				attributes : ""
			},

			setupDom : function () {
				this.sup();

				this.$flash = this.$slideshow.find("#flash");
			},

			loadComplete : function () {
				var src = Config.get().STATIC_URL + "/swf/cfnewlogo.swf",
					id = "flash";

				// embed swf
				// swfobject.embedSWF(src, id, "100%", "100%", "9.0.0", null, this.flash.flashvars, this.flash.params, this.flash.attributes);
				this.sup.apply(this, arguments);
			},

			onResize : function (e) {
				this.sup.apply(this, arguments);

				if (!this.$flash) {
					return;
				}


				var aW = this.$feature.width(),
					aH = this.availableHeight() - 55,
					aR = aW / aH,
					w = 420,
					h = 734,
					r = w / h;

				if (aW / r > aH) {
					w = aH * r;
					h = aH;
				} else {
					h = aW / r;
					w = aW;
				}

				this.$flash.css({
					"width" : w,
					"height" : h
				});
			},
		});
	}
);
