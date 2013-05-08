define(
	[
		"../Modal",
		"$",
		"../../templates/dip-downloader",
		"swfobject",
		"../../Config",
		"../../data/User"
	],

	function (Modal, $, template, swfobject, Config, User) {

		"use strict";

		var moment = require("moment");

		return Modal.extend({


			loadComplete : function () {
				this.sup();

				var markup = template({});

				$(".modal").html(markup);

				this.sup();

				this.embedFlash();
				this.options = $(".dip-downloader ul li ");
				this.options.on("click", "a", this.downloadItem);

				var flashVersion = swfobject.getFlashPlayerVersion();
				if (flashVersion.major >= 11 && flashVersion.minor >= 4) {
					$(".noflash").css("display", "none");
				}
			},

			embedFlash : function () {

				var district = User.get("district").split(" ")[1],
					dobMoment = moment(User.get("dob"), "YYYY-MM-DD"),
					equalize = function (input) {
						if (input === "") {
							return "unknown";
						}

						if (input === "none") {
							return "unknown";
						}

						return input;
					},
					location = equalize(User.get("location")),
					DIPConfig = {
						// ** user info
						name : User.get("name"),
						id : '119577215',
						did : '1334218',
						district : district,//'5',
						service : 'T',
						email : '',
						locale : '',
						location : location,//'SANTA MONICA, CA',
						city : location,
						state : location.split(",")[1],//'CA',
						country : equalize(User.get("country")),//'USA',
						gender : User.get("gender"), //"m"
						dob : User.get("dob") !== "None" ? dobMoment.format('MM-DD-YYYY') : 'UNKNOWN',
						dobMonth : dobMoment.format('M'),//'9',
						dobDay : dobMoment.format('D'),//'29',
						dobYear : dobMoment.year(),//'1977',
						citizenID : User.get('pcn'),//'PNE236.8J9767',
						cardCreated : 'true',
						occupation : User.get('occupation'),//'Systems Analyst',
						listChecked : 'false',

						token : User.get('csrfmiddlewaretoken'),

						// URL to district facebook page
						facebookPageUrl : 'http://www.facebook.com/district' + district + 'pn',

						// user uploaded photo
						userPhotoPath : User.get('imgURL'),//'https://client-projects.com/lionsgate/2012/web/site/hge/prototype/images/governor.jpg',

						// saving img to DB paths
						saveToDB_URL : '/citizenship/save_image',
						checkSaveProgressDB_URL : '',

						//  already built DIP images saved on server
						imagePath_facebook : '', //** path to facebook DIP if already exists
						imagePath_facebookCover : '', //** path to facebook cover DIP if already exists
						imagePath_twitter : '', //** path to twitter district icon if already exists
						imagePath_google : '', //** path to google+ DIP if already exists
						imagePath_card : '', //** path to DIP if already exists
						imagePath_tablet : '', //** path to tablet DIP if already exists

						//  image assets to load to build DIP
						logo_initial: Config.get("STATIC_URL") + 'img/dip/badges/Initial/' + User.get("badgeAsset"), //kais82h665g.png',
						logo_googlePlus: Config.get("STATIC_URL") + 'img/dip/googlePlus/' + User.get("googlePlusCard"), //l90km23kas9.jpg',
						logo_twitterSmall: Config.get("STATIC_URL") + 'img/dip/badges/Twitter/Small/' + User.get("twitterBadgeSmall"), //k23ns889.jpg',
						logo_twitterLarge: Config.get("STATIC_URL") + 'img/dip/badges/Twitter/Large/' + User.get("twitterBadgeLarge"),//lsijduy7788.jpg',
						cardRight: Config.get("STATIC_URL") + 'img/dip/cardRight/' + User.get("cardRight"), //90mn2378.jpg',
						tabletBG: Config.get("STATIC_URL") + 'img/dip/tablet/tabletbg.jpg',
						facebookCover: Config.get("STATIC_URL") + 'img/dip/facebook/facebookCover.jpg'
					};

				// make dip config accessable for Flash ExternalInterface call.
				window.DIPConfig = DIPConfig;//configJSON;
				window.getDIPjson = function () {
					return window.DIPConfig;
				};

				var swfVersionStr = "11.4.0";
				// To use express install, set to playerProductInstall.swf, otherwise the empty string.
				var xiSwfUrlStr = "playerProductInstall.swf";
				var flashvars = {
					onSaveSuccess: 'onSaveSuccess',
					onSaveError: 'onSaveError',
					userJSON : "getDIPjson"
				};
				var params = {};
				params.quality = "high";
				params.bgcolor = "#181D25";
				params.allowscriptaccess = "sameDomain";
				params.allowfullscreen = "true";
				var attributes = {};
				attributes.id = "IDDownloader";
				attributes.name = "IDDownloader";
				attributes.align = "middle";
				swfobject.embedSWF(
					"/static/swf/IDDownloader.swf", "myFlashContent",
					"0", "0",
					swfVersionStr, xiSwfUrlStr,
					flashvars, params, attributes);
				// JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
				swfobject.createCSS("#myFlashContent", "display:block;text-align:left;");

			},

			downloadItem : function (e) {
				e.preventDefault();

				var flash = document.getElementById("IDDownloader"),
					type = $(e.currentTarget).attr("href").slice(1);

				$(".download-options").parent().addClass("loading");

				this.publish("track.event", {
					category : "Download District ID",
					action : "CTA Click : " + type,
					label : "Count"
				});

				window.onSaveError = function () {

					$(".download-options").parent().removeClass("loading");
					$(".download-options").parent().addClass("error");

					window.onSaveError = null;
					window.DIPConfig = null;
				};

				window.onSaveSuccess = this.proxy(function () {

					this.setTimeout(function () {
						this.publish("closeModal", {});
					}, 1000);

					this.publish("track.event", {
						category : "Download District ID",
						action : "Download Successful : " + type,
						label : "Count"
					});

					window.onSaveSuccess = null;
					window.DIPConfig = null;
				});

				flash.downloadID(type);
			}




		});
	}
);
