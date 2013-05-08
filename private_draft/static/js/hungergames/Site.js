define(

	[
		"$",
		"rosy/base/Class",
		"./Teaser",
		"./Config",
		"rosy/utils/tracking/GA",
		"./routes/HistoryRouter",
		"./routes/HashRouter",
		"./modules/grid/Grid",
		"./modules/Footer",
		"./modules/Header",
		"./modules/Sparks",
		"./modules/Share",
		"./modules/externalnav/ExternalNav",
		"./modules/Intro",
		"./modules/Shortcuts",
		"./data/User"
	],

	function ($, Class, Teaser, Config, GA, HistoryRouter, HashRouter, Grid, Footer, Header, Sparks, Share, ExternalNav, Intro, Shortcuts, User) {

		"use strict";

		var win = $(window);

		window.console = window.console || {
			log : function () {},
			dir : function () {},
			error : function () {}
		};

		var URL_VARS = {};

		window.location.href.replace(/[?&]+([^=&]+)(?:[=]*)([^&]*)/gi, function (m, key, value) {
			URL_VARS[key] = value.split("#")[0];
		});


		var IS_MOBILE = {

			Android: function () {
				return navigator.userAgent.match(/Android/i);
			},

			BlackBerry: function () {
				return navigator.userAgent.match(/BlackBerry/i);
			},

			iOS: function () {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},

			Opera: function () {
				return navigator.userAgent.match(/Opera Mini/i);
			},

			Windows: function () {
				return navigator.userAgent.match(/IEMobile/i);
			},

			any: function () {
				return (IS_MOBILE.Android() || IS_MOBILE.BlackBerry() || IS_MOBILE.iOS() || IS_MOBILE.Opera() || IS_MOBILE.Windows());
			}
		};

		var GA_ID = window.location.host === "hgedev.ff0000.com" ? "UA-39734145-2" : "UA-31651-303";

		return Class.extend({

			historyRouter : null,
			hashRouter : null,

			sparks : Sparks,
			share : Share,
			loader : null,
			header : null,
			teaser : null,

			init : function (settings) {

				if (settings.IS_TEASER) {
					this.teaser = new Teaser();
				}

				Config.set(settings);

				//GA.debug();
				GA.initialize(GA_ID, {initialPageView : settings.IS_TEASER});

				if (URL_VARS.registered) {
					this.publish("track.setCustomVar", {
						index : 1,
						name : "User Registered",
						value : "Yes",
						scope : 1
					});
				}

				if (settings.IS_LOGGED_IN) {
					this.publish("track.setCustomVar", {
						index : 2,
						name : "User Logged In",
						value : "Yes",
						scope : 1
					});
				}

				// tell User to check for User JSON on the page.
				this.publish("update_user", {});
				var $ieLogo = $(".ie-logo");

				this.setTimeout(function () {
					$ieLogo.addClass("active");

					this.setTimeout(function () {
						$ieLogo.removeClass("active");
					}, 1500);

				}, 3000);


				this.loader = new Intro($("#container"), this.introComplete, true);
				this.header = new Header();

				this.initShare();
			},

			initShare : function () {

				var data,
					href = window.location.href,
					isMobile = IS_MOBILE.any(),
					pinterestTxt = encodeURIComponent("'The Hunger Games: Catching Fire' Teaser Trailer | Watch it now, only at TheHungerGamesExplorer.com... Share #TheSpark | #HungerGamesExplorer #TheHungerGames #CatchingFire"),
					tumblrTxt = encodeURIComponent("'The Hunger Games: Catching Fire' Teaser Trailer | Watch it now & share #TheSpark, only at www.TheHungerGamesExplorer.com"),
					twitterTxt = encodeURIComponent("Watch '#TheHungerGames: #CatchingFire' Teaser Trailer & share #TheSpark... Only at The #HungerGamesExplorer");

				this.$share = {};
				this.$share.twitter = $(".twitter-share");
				this.$share.facebook = $(".facebook-share");
				this.$share.pinterest = $(".pinterest-share");
				this.$share.tumblr = $(".tumblr-share");
				this.$share.gplus = $(".gplus-share");

				this.$share.twitter.attr("href", "http://twitter.com/intent/tweet?text=" + twitterTxt);

				if (isMobile) {
					this.$share.facebook.attr("href", "http://m.facebook.com/sharer.php?u=" + encodeURIComponent(href));
				}

				else {
					this.$share.facebook.attr("href", "http://www.facebook.com/share.php?u=" + encodeURIComponent(href));
				}

				this.$share.pinterest.attr("href", "http://pinterest.com/pin/create/bookmarklet/?media=" + this.imgPath("share/154x154.jpg") + "&is_video=false&description=" + pinterestTxt + "&url=" + href);
				this.$share.tumblr.attr("href", "http://www.tumblr.com/share/photo?source=" + this.imgPath("share/154x154.jpg") + "&caption=" + tumblrTxt + "&click_thru=" + encodeURIComponent(href) + "&tags=" + encodeURIComponent("Catching Fire, Hunger Games Explorer, The Hunger Games"));
				this.$share.gplus.attr("href", "https://plus.google.com/share?url=" + encodeURIComponent(href));

				this.$share.twitter.attr("target", "_blank");
				this.$share.facebook.attr("target", "_blank");
				this.$share.pinterest.attr("target", "_blank");
				this.$share.tumblr.attr("target", "_blank");
				this.$share.gplus.attr("target", "_blank");

				$(document).on('click', '.twitter-share, .facebook-share, .gplus-share, .pinterest-share, .tumblr-share', Share.share);
			},

			imgPath : function (img, noEncode) {
				var p = window.location.protocol + "//" + window.location.host + "/static/img/" + img;
				if (!noEncode) {
					p = encodeURIComponent(p);
				}
				return p;
			},

			introComplete : function () {

				if (!this.teaser) {
					this.historyRouter = new HistoryRouter();
					this.hashRouter = new HashRouter();
				}

				this.footer = new Footer();
				this.externalNav = new ExternalNav();

				this.subscribe("closeModal", this.closeModal);

				this.stickyMenu();
			},

			stickyMenu : function () {
				var navSelectors = [".filter", ".login-info", ".legal-dropup", ".share-dropup", ".region-dropup", ".search"],
					$navs = $(navSelectors.join(', ')),
					i;

				// sticky drop downs stay open when clicked.
				function stickyMenu(nav) {
					$(document).on('mousedown touchstart', function (e) {
						// we clicked inside the nav
						if ($(e.target).closest(nav).length) {
							if (!nav.is('.active')) {
								e.preventDefault();
							}
							nav.addClass('active');
						} else {
							nav.removeClass('active');
						}
					});

					nav.on("mousedown touchstart", function (e) {
						if (!nav.is('.active')) {
							$navs.removeClass('active');
							nav.addClass('active');
							e.preventDefault();
							e.stopPropagation();
						}
					});

					if (!window.navigator.msPointerEnabled && !Modernizr.touch) {
						nav.on("mouseleave", function () {
							nav.removeClass('active');
						});
					}
				}

				for (i = 0; i < navSelectors.length; i++) {
					stickyMenu($(navSelectors[i]));
				}
			},

			closeModal : function () {
				$(".modal").removeClass("show");
				$('.blackout, .modal').hide();
				this.hashRouter.close();
			}

		});
	}
);
