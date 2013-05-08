define(
	[
		"rosy/modules/Module",
		"$",
		"../Config",
		"../templates/intro",
		"$plugin!cookie"
	],

	function (Module, $, Config, template, cookie) {

		"use strict";

		return Module.extend({

			loader : null,

			init : function (selector, completeCallback, skip, persistent) {
				this.sup();

				this.completeCallback = completeCallback;

				var debug = true || false,
					introViewed = ($.cookie('HGE_intro_viewed') === undefined) ? false : true,
					skipIntro = (skip === undefined || !skip) ? false : skip;

				if (skipIntro) {
					$("#container header").addClass("intro-skip");
					$("#container footer").addClass("intro-skip");
					this.completeCallback();
					return false;
				}


				if (!introViewed || debug || persistent) {
					$.cookie('HGE_intro_viewed', 'true', { expires: 31, path: '/' });

					var data = {
						message: "INITIALIZING",
						STATIC_URL : Config.get("STATIC_URL"),
						REGION : Config.get("REGION")
					},
					markup = template(data);


					selector.append(markup);
					this.loader = selector.find(".intro-animation");

					this.animate(persistent);

				} else {
					$("#container header").addClass("intro-skip");
					$("#container footer").addClass("intro-skip");

					this.completeCallback();
				}
			},

			animate : function (persisitent) {

				var $divs = this.loader.find("div");

				this.setTimeout(function () {
					$divs.addClass("show initializing");
				}, 200);

				if (persisitent) {

					this.setTimeout(function () {
						$divs.removeClass("initializing show");
					}, 2400);

					this.setTimeout(function () {
						$divs.addClass("show stand-by");
					}, 3200);

					this.setTimeout(function () {
						$divs.removeClass("stand-by show");
					}, 5400);

					this.setTimeout(function () {
						this.animate(persisitent);
					}, 6200);
				}

				if (!persisitent) {

					this.setTimeout(function () {
						$divs.addClass("step-2");
					}, 1500);

					this.setTimeout(function () {
						$divs.addClass("intro");
					}, 3200);

					this.setTimeout(function () {
						this.glitch();
					}, 4000);

					this.setTimeout(function () {
						this.clearGlitch();
					}, 6000);
				}
			},

			glitch : function () {
				this.loader.find("div").addClass("glitch");

				this.setTimeout(function () {
					this.loader.find("div").removeClass("glitch");
				}, 200);

				this.glitchTimer = this.setTimeout(function () {
					this.glitch();
				}, this.randInt(1000, 3000));
			},

			clearGlitch : function () {
				if (this.glitchTimer) {
					clearTimeout(this.glitchTimer);
					this.loader.find("div").removeClass("glitch");
				}

				this.loader.find("div").removeClass("");
				this.loader.find("div").addClass("hide");

				$("#container header").addClass("intro");
				$("#container footer").addClass("intro");

				this.setTimeout(this.cleanUp, 900);
			},

			cleanUp : function () {
				this.completeCallback();
				this.loader.remove();
			},

			randInt : function (min, max) {

				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
		});
	}
);
