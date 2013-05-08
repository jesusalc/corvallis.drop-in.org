define(
	[
		"rosy/modules/Module",
		"$",
	],

	function (Module, $) {

		"use strict";

		return Module.extend({


			init : function () {
				this.sup();

				this.imageFileInput = $("#id_pic");
				this.imageFileInput.on("change", this.readURL);
			},

			readURL : function (e) {
				var input = e.currentTarget;

				if (input.files && input.files[0]) {
					var reader = new FileReader();

					reader.onload = this.proxy(function (e) {
						$('#uploadPreview').attr('src', e.target.result);
						$('#uploadPreview').on("load", this.resizeThumb);

					});

					reader.readAsDataURL(input.files[0]);
				}
			},

			resizeThumb : function (e) {

				var preview = $('#uploadPreview'),
					w = preview.width(),
					h = preview.height(),
					ratioW = 60 / w,
					ratioH = 60 / h;

				if (w < h) {
					preview.attr("width", w * ratioW);
					preview.attr("height", h * ratioW);
				} else {
					preview.attr("width", w * ratioH);
					preview.attr("height", h * ratioH);
				}

			}
		});
	}
);


