define(
	[
		"../Modal",
		"$",
		"../../templates/profile-edit",
		"../../utils/GoogleMaps",
		"../../modules/userprofile/ImageUploadPreview",
		"../../data/User"
	],

	function (Modal, $, template, GoogleMaps, ImageUploadPreview, User) {

		"use strict";

		var moment = require("moment");

		return Modal.extend({


			loadComplete : function () {
				this.sup();

				var genderHelper = function (gender) {
						return {
							isMale : gender === "m",
							isFemale : gender === "f",
							isUnknown: gender === "u"
						};
					},
					dobHelper = function (dob) {
						var date = moment(dob, "YYYY-MM-DD").format("MM/DD/YYYY");

						if (date === "01/01/0000") {
							return false;
						} else {
							return date;
						}
					},
					templateConfig = {
						email: User.get("email"),
						location : User.get("location"),
						country : User.get("country"),
						gender : genderHelper(User.get("gender")),
						imgURL : User.get("imgURL"),
						dateOfBirth : dobHelper(User.get("dob")),
						phoneNumber : User.get("mobileNumber"),
						token : User.get("csrfmiddlewaretoken"),
						emailList : User.get("emailList")
					},
					markup = template(templateConfig);

				$(".modal").html(markup);
				$(".modal").addClass("edit-profile-window");

				this.sup();

				this.googleMaps = new GoogleMaps();
				this.imageUploadPreview = new ImageUploadPreview();


				//$("input[type='tel']").on("keypress", this.onKeyPress);

				$(".edit button").click(this.validate);

				$(".deactivate").click(this.showDeactivateConfirmation);
			},

			closeModal : function () {
				this.sup();
				$(".modal").removeClass("edit-profile-window");
			},

			/*onKeyPress : function (e) {
				// Allow: backspace, delete, tab and escape
				if (e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 27 ||
					// Allow: Ctrl+A
					(e.keyCode === 65 && e.ctrlKey === true) ||
					// Allow: home, end, left, right
					(e.keyCode >= 35 && e.keyCode <= 39)) {
						// let it happen, don't do anything
					return;
				} else {
					// Ensure that it is a number and stop the keypress
					if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
						e.preventDefault();
					}
				}
			},*/

			validate : function (e) {
				//e.preventDefault();

				var emailInput = $("input[type='email']"),
					emailAddress = emailInput.val();

				if (!this.validateEmail(emailAddress)) {

					emailInput.addClass("error");
					emailInput.val("ERROR: a valid email is required.");

					emailInput.focus(function () {
						emailInput.removeClass("error");
						emailInput.val(emailAddress);
						emailInput.off();
					});
					return false;
				}

				if (!this.validateBirthday()) {
					var dobInput = $("input[name='dob']"),
						dobVal = dobInput.val();

					dobInput.addClass("error");
					dobInput.val("ERROR: a valid date is required.");

					dobInput.focus(function () {
						dobInput.removeClass("error");
						dobInput.val(dobVal);
						dobInput.off();
					});

					return false;
				}

				//console.log("submit to " + $(".edit-profile form").attr("action"));
				//$(".edit-profile form").submit();
				return true;
			},

			validateBirthday : function () {
				var dobInput = $("input[name='dob']"),
					dobValue = dobInput.val();

				var validformat = /^\d{2}\/\d{2}\/\d{4}$/; //Basic check for format validity
				var dateIsValid = false;

				if (dobValue && validformat.test(dobValue)) {
					dateIsValid = moment(dobValue, "MM-DD-YYYY").isValid();
				}

				if (dobValue === null) {
					dateIsValid = true;
				}

				return dateIsValid;
			},

			handleResponse : function (response) {
				// if response.success
				// User.update(response);

				// if response.error
				//
			},

			validateEmail : function (email)
			{
				// http://stackoverflow.com/a/9204568/864013
				var re = /\S+@\S+\.\S+/;
				return re.test(email);
			},

			showDeactivateConfirmation : function (e) {
				e.preventDefault();

				$(".modal .content .wrapper").addClass("confirm-deactivation");

				$(".modal .content .cancel").on("click", this.cancelDeactivation);
			},

			cancelDeactivation : function (e) {
				e.preventDefault();
				$(".modal .content .wrapper").removeClass("confirm-deactivation");
				$(".modal .content .cancel").off();
			}

		});
	}
);
