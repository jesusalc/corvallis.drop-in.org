define(
	[
		"../Base",
		"$",
		"../../data/User",
		"../../templates/profile-card",
		"../grid/Grid",
		"../grid/Delete",
		"$plugin!quickfit",
		"swfobject"
	],

	function (Base, $, User, template, Grid, DeletePostConfirmation, $quickFit, swfobject) {

		"use strict";

		return Base.extend({

			load : function () {
				this.loadComplete();
			},

			loadComplete : function () {
				this.sup();

				var csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").attr("value");
				User.set("csrfmiddlewaretoken", csrfmiddlewaretoken);

				$(".user-info").addClass("show");
				$("#grid-wrapper").addClass("show");

				if (window.GRID_JSON_DATA) {
					if (window.GRID_JSON_DATA.object_list.length > 0) {
						$(".grid").empty();
					}

					this.grid = new Grid();
					this.grid.load();

					this.deletePost = new DeletePostConfirmation();
				}

				//$(".name").fitText({minFontSize: 10, maxFontSize: 19});
				$(".name").quickfit({min: 10, max: 19});

				this.checkErrors();

				var flashVersion = swfobject.getFlashPlayerVersion();
				if (flashVersion.major === 0) {
					$(".icon-card").remove();
				}
			},

			checkErrors : function () {
				if (location.hash.indexOf("error") < 0) {
					return;
				}

				var errorNum = location.hash.replace(/.*error\//, ''),
					dom = $(".error");

				dom.removeClass("hidden");

				switch (~~errorNum) {
				case 1:
					dom.html('This account is already connected to another user.');
					break;
				case 2:
					dom.html('Please verify that your Google account has an associated YouTube account.');
					break;
				case 3:
					dom.html('YouTube currently unavailable.');
					break;
				case 4:
					dom.html('There was an error connecting this account.');
					break;
				}
			},

			updateCard : function (e) {
				var data = {
					district: User.get("district"),
					imgURL: User.get("imgURL"),
					backgroundImg : User.get("backgroundImg"),
					name : User.get("name"),
					dateOfBirth : User.get("dateOfBirth"),
					gender: User.get("gender"),
					location : User.get("location"),
					country : User.get("country"),
					occupation : User.get("occupation"),
					pcn : User.get("pcn")
				};

				var markup = template(data);
				$("figure").html(markup);
			},

			destroy : function () {
				if (this.grid !== undefined) {
					this.grid.destroy();
					this.grid = null;
				}
			}
		});
	}
);
