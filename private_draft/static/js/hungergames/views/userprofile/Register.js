define(
	[
		"../Base",
		"$",
		"../../utils/GoogleMaps",
		"../../modules/userprofile/ImageUploadPreview",

	],

	function (Base, $, GoogleMaps, ImageUploadPreview) {

		"use strict";

		return Base.extend({

			loadComplete : function () {
				this.sup();

				this.googleMaps = new GoogleMaps();
				this.imageUploadPreview = new ImageUploadPreview();

				$("button").click(this.validate);
			},

			validate : function (e) {
				//e.preventDefault();

				var userNameInput = $("input[name='name']"),
					userName = userNameInput.val();

				if (userName.length < 1) {
					userNameInput.addClass("error");

					userNameInput.focus(function () {
						userNameInput.removeClass("error").off();
					});

					return false;
				}

				var emailInput = $("input[type='email']"),
					emailAddress = emailInput.val();

				if (!this.validateEmail(emailAddress)) {
					emailInput.addClass("error");

					emailInput.focus(function () {
						emailInput.removeClass("error").off();
					});
					return false;
				}


				if (!$("input[name=terms]")[0].checked) {
					$(".tos").addClass("error");

					return false;
				}


				//$(".register-form form").submit();
				return true;
			},

			validateEmail : function (email)
			{
				// http://stackoverflow.com/a/9204568/864013
				var re = /\S+@\S+\.\S+/;
				return re.test(email);
			}
		});
	}
);
