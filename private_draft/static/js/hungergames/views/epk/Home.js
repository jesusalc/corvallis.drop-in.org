define(

	[
		"./base/Base",
		"$",
		"../../modules/epk/Slideshow",
		"../../modules/epk/CastSlideshow",
	],

	function (Base, $, Slideshow, CastSlideshow) {

		"use strict";

		/*global Modernizr */

		var transform = Modernizr.prefixed("transform"),
			win = $(window); // requires Modernizr.prefixed

		return Base.extend({

			$articles : null,
			$loader : null,
			$slideshows : null,
			$modal : null,

			$covers : null,

			slideshows : null,
			xhr : null,
			isInited : false,
			largeLayout : false,

			scrollTop : -1, // only works if 0 or more

			autoCycleDelay : 5000,
			autoCycleTimer : null,
			autoCycleIndex : 0,
			autoCycleTargets : null,

			imageType : {
				"photo" : {
					"small" : 600,
					"medium" : 900,
					"large" : 1000
				},

				"poster" : {
					"small" : 325,
					"medium" : 455,
					"large" : 622
				}
			},

			imageBuffer : null,

			load : function () {
				this.dom = $("#main");
				this.loadComplete();
			},

			loadComplete : function () {
				var slideshow;

				this.slideshows = [];
				this.$articles = this.dom.find(".container article");
				this.$loader = this.dom.find(".loader");
				this.$slideshows = this.$articles.filter(".slideshow");

				this.$covers = this.$articles.find(".items");
				this.imageBuffer = [];

				this.customizeLayout();
				this.sup();
			},

			autoCycle : function () {
				var t = this.autoCycleTargets.length - 1,
					a = this.autoCycleIndex,
					targ;

				if (t < 0) {
					return;
				}

				this.autoCycleIndex = (a < 0) ? t : (a > t) ? 0 : a; // move through each slideshow

				targ = this.autoCycleTargets[this.autoCycleIndex];

				if (targ.shouldStopAutoCycle) {
					this.autoCycleTargets.splice(this.autoCycleIndex, 1);
					return this.autoCycle(); // next...
				}

				targ.getNext(true);

				this.autoCycleIndex++;

				this.autoCycleTimer = this.setTimeout(this.autoCycle, this.autoCycleDelay);
			},

			// fixup the grid based on the articles showing

			addListeners : function () {
				var slideshow;

				this.subscribe(Slideshow.CHANGE_ROUTE, this.route);

				this.dom.find("[data-history]").on("click", this.onClickLink);

				// create a slideshow for each slideshow-module
				for (var i = this.$slideshows.length - 1; i >= 0; i--) {
					if (this.$slideshows.eq(i).hasClass("cast-crew")) {
						slideshow = new CastSlideshow(this.$slideshows.eq(i));
					} else {
						slideshow = new Slideshow(this.$slideshows.eq(i));
					}

					this.slideshows.push(slideshow);
				}

				this.autoCycleTargets = this.slideshows;
				this.autoCycleTargets.reverse();

				this.sup.apply(this, arguments);
			},

			removeListeners : function () {
				this.unsubscribe(Slideshow.CHANGE_ROUTE, this.route);

				this.sup.apply(this, arguments);
			},

			onResize : function (e) {
				this.respondToImageSize();
			},

			respondToImageSize : function () {
				var i = this.$covers.length - 1,
					size,
					$cur,
					$item,
					data,
					boundary,
					width,
					curW,
					nextW;

				for (i; i >= 0; i--) { // loop through each article that has images
					$cur = this.$covers.eq(i);
					data = $cur.data() || {};
					boundary = this.imageType[data.imageType];

					if (boundary) { //
						width = $cur.width();
						curW = boundary[data.size];

						for (size in boundary) {
							if (width <= boundary[size]) {
								break;
							}
						}

						nextW = boundary[size];

						if (nextW > curW) { // swap to larger image
							$item = $cur.find('a').eq(data.index - 1);
							$cur.data("size", size);

							this.swapImage($cur, $item.data(size), i, size);
						}
					}

				}
			},

			swapImage : function ($cur, src, index) {

				if (this.imageBuffer[index]) {
					this.imageBuffer[index].src = "";
				}

				this.imageBuffer[index] = new Image();
				this.imageBuffer[index].onload = function () {
					$cur.css({
						"background-image" : "url(" + src + ")"
					});
				};

				this.imageBuffer[index].src = src;
			},

			onClickLink : function (e) {
				if (!Modernizr.history) {
					return true;
				}

				var href = $(e.currentTarget).attr("href");
				this.publish(Slideshow.CHANGE_ROUTE, href);
				return false;
			},

			// ajax-load the detail page and fade it in
			route : function (n, url) {
				var title;

				// until further notice these pages simply reload.
				window.location = url;
				return false;

				/*
				if (!Modernizr.history) {
					window.location = url;
					return false;
				}

				if (this.xhr) {
					this.xhr.abort();
				}

				this.xhr = $.ajax({
					url: url,
					dataType: "html",
					success: $.proxy(function (response) { // use AJAX and manage ERRORS
							title = response.match(/<title>(.*?)<\/title>/);
							document.title = title[1];

							this.$modal = $(response).find("#modal");
							this.dom.append(this.$modal);
							this.router.route(url, {history : true});
						}, this),
					error : function () {
						// $.publish(EVENTS.PAGE_LOAD_ERROR, [state]);
						// $.publish("track", [{type: "event", category: "page-load", action: "error", label: state.url }]);
					}
				});
				*/
			},

			customizeLayout : function () {
				// step thru,
				this.$articles.each(function (index) {
					var xPos;
					// left v right
					xPos = ($(this).position().left < 100) ? "-200%" : "200%";
					$(this)[0].style[transform] = "translateX(" + xPos + ")";
				});
			},

			transitionIn : function () {

				if ($(".error-page").length < 1) {
					var i = this.$articles.length - 1,
						delay = 150;

					this.dom.css("height", "auto");
					this.onResize();

					/*
					if (this.data.scrollTop >= 0) {
						$("html, body").animate({
							scrollTop: this.data.scrollTop
						}, 500);
					}
					*/

					for (i; i >= 0; i--) {
						this.$articles.eq(i).transition({
							queue: false,
							opacity : 1,
							x : 0,
							easing : "easeOutCirc",
							duration : "350ms",
							delay : delay + (100 * i) + Math.round(Math.random() * 100) + "ms"
						});
					}

					// transition loader
					this.$loader.transition({
						queue: false,
						opacity : 0,
						easing : "easeOutCirc",
						duration : "350ms",
						delay : delay,
						complete : this.transitionInComplete
					});
				}

				this.sup();
			},

			transitionInComplete : function () {
				this.$loader.remove();
				this.sup();

				this.addListeners();

				// this.setTimeout(this.autoCycle, this.autoCycleDelay);
			},

			destroy : function () {
				window.clearTimeout(this.autoCycleTimer);

				var i = this.slideshows.length - 1;

				this.removeListeners();

				for (i; i >= 0; i--) {
					this.slideshows[i].destroy();
				}

				this.slideshows = null;
				this.autoCycleTargets = null;
				this.sup();
			}

		});
	}
);
