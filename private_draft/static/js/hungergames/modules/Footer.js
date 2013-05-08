define(
	[
		"rosy/modules/Module",
		"$"
	],

	function (Module, $) {

		"use strict";

		return Module.extend({

			$container : null,
			$moviesBtn : null,
			$flare : null,
			$ieLogo : null,

			flareTimer : null,
			transitioning : false,

			init : function () {
				this.$container = $("#container > footer");

				this.$movies = this.$container.find(".movies-nav .movies");
				this.$moviesBtn = this.$container.find(".movies-nav .button");

				this.$ieLogo = this.$container.find(".ie-logo");
				this.$flare = this.$container.find(".flare");

				this.addLogoFlare();
				this.addListeners();
			},

			addLogoFlare : function () {
				this.$flare.toggleClass("active");
				this.flareTimer = this.setTimeout(this.addLogoFlare, this.$flare.hasClass("active") ? 2200 : 5000);
			},

			addListeners : function () {
				this.$moviesBtn.on("click tap", this.onClickMovies);
				// Atlas Tracking
				this.$ieLogo.on("mouseenter", this.onHoverIELogo);
				// End Atlas Tracking
			},

			// Atlas Tracking
			onHoverIELogo : function () {
				var i = new Image();
				i.src = 'http://view.atdmt.com/action/SMG_MRTINX_CF_IELogo_Hover';
			},
			// End Atlas Tracking

			onClickMovies : function (e) {
				var disp = this.$movies.css("display");
				this.$movies.css("display", (disp === "none") ? "block" : "none");
			},

			destroy : function () {
				if (this.flareTimer) {
					clearTimeout(this.flareTimer);
					this.flareTimer = null;
				}
			}

		});
	}
);
