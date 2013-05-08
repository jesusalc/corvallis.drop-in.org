define(

	[
		"./Base",
		"rosy/polyfills/request-animation-frame",
		"$",
		"../../../modules/epk/Flip",
		"lodash",
		"$plugin!imagesloaded",
		"$plugin!transit"
	],

	function (Base, raf, $, Flip, lodash, $imagesLoaded, $transit) {

		"use strict";

		var win = $(window),
			body = $('html, body');

		return Base.extend({

			"static" : {
				// parentClass : Home,
			},

			$main : null,
			$loader : null,
			$feature : null,
			$image : null,
			$list : null,
			$title : null,

			$closeBtn : null,


			$slideshow : null,
			$photo : null,

			$breadcrumb : null,

			flip : null,

			controlsOffset : 134,
			minHeight : 200,
			minWidth : 300,

			image : null,
			imageData : null,

			index : 0,

			oScrollTop : 0,

			loadComplete : function () {
				this.setupDom();

				// this.onResizeDebounce();
				this.getCurrentImage(this.$photo.data("slug"));

				this.sup();
			},

			setupDom : function () {
				this.$main = $("#main");

				this.$feature = this.dom.find("#feature");
				this.$slideshow = this.$feature.find(".slideshow");

				this.$loader = this.dom.find(".loader");
				this.$container = this.dom.find(" > .container");

				this.$photo = this.$slideshow.find(".container");
				this.$image = this.$slideshow.find("img");

				this.$list = this.dom.find(".thumbnails a");

				this.$title = this.dom.find(".section-title h1");

				this.$nextBtn = this.$slideshow.find(".controls");
				this.$closeBtn = this.dom.find(".controls.close");

				this.$breadcrumb = $(".breadcrumb"); // sigh, sometimes, the breadcrumb is too large and we need to push the modal down =(

				if (this.$nextBtn.length) {
					this.controlsOffset = 0;
				}
			},

			getCurrentImage : function (slug) {
				var $targ = this.$list.filter('[data-slug="' + slug + '"]');

				this.imageData = $.extend({}, $targ.data(), {title : $targ.attr("title")}); // get next image data

				// activate thumbnail
				this.$list.removeClass("active");
				$targ.addClass("active");

				this.index = $targ.parent().index(); // change index
			},

			update : function (params, data) {
				this.getCurrentImage(params.slug);

				// load next image
				this.image = new Image();
				this.image.src = this.imageData.srcLarge;
				this.image.onload = $.proxy(this.transitionContentOut, this);
			},

			transitionContentOut : function () {
				this.$feature.transition({
					opacity : 0,
					easing : "easeInOutQuad",
					duration : "500ms",
					complete : this.transitionContentIn
				});


			},

			transitionContentIn : function () {
				this.replaceContent();

				this.onResizeDebounce(); // resize for new image

				this.$feature.transition({ // transitionContentIn
					opacity : 1,
					easing : "easeInOutQuad",
					duration : "500ms",
					delay : "300ms"
				});

				body.animate({
					scrollTop: 0
				}, 500);
			},

			// replace titles and images
			replaceContent : function () {
				// replace h2
				this.$title.text(this.imageData.title);
				this.$image.attr("src", this.image.src); // swapContent
			},


			transitionIn : function () {
				this.sup();

				this.oScrollTop = Math.max($("html").scrollTop(), $("body").scrollTop()); // original scroll top

				body.animate({
					scrollTop: 0
				}, 500);

				this.$loader.transition({ // transition loader
					opacity : 0,
					easing : "easeInOutQuad",
					duration : "350ms",
					delay : "20ms"
				});

				this.$container.transition({ // transition in page
					queue: false,
					opacity : 1,
					easing : "easeInOutQuad",
					duration : "500ms",
					delay : "0ms",
					complete : this.transitionInComplete
				});
			},

			transitionInComplete : function () {
				this.addListeners();
				this.sup();
			},

			transitionOut : function () {
				this.$container.transition({
					queue: false,
					opacity : 0,
					easing : "easeInOutQuad",
					duration : "500ms",
					complete : this.transitionOutComplete
				});
			},

			addListeners : function () {
				// win.on("resize", $.proxy(this.onResize, this));
				if (this.data.history) { // temporary fix, need to handle with historyPush later
					this.$closeBtn.on("click", this.onClose);
				}

				this.$photo.imagesLoaded($.proxy(this.onResizeDebounce, this));
				this.$list.imagesLoaded($.proxy(this.onImagesLoaded, this));

				this.$list.on("click", this.onClickThumb);
				this.$nextBtn.on("click", this.onClickNext);

				this.sup();
				// this.flip = new Flip(this.$photo, this.$photo, this.$slideshow.find("[data-flip-target]"));
			},

			removeListeners : function () {
				// win.off("resize", this.onResize);
				this.$photo.unbind('.imagesLoaded');
				this.$list.unbind('.imagesLoaded');

				this.$nextBtn.off("click", this.onClickNext);

				this.$closeBtn.off("click", this.onClose);

				this.sup();
			},

			onClickThumb : function (e) {
				var url = $(e.currentTarget).attr("href");

				this.router.route(url, {history : true});

				return false;
			},

			onClickNext : function (e) {
				var direction  = $(e.currentTarget).hasClass("next") ? 1 : -1,
					total = this.$list.length - 1,
					index = this.index + direction;

				this.index = (index < 0) ? total : (index > total) ? 0 : index;

				this.$list.eq(this.index).trigger("click");
			},

			onClose : function (e) {
				var url = $(e.currentTarget).attr("href");

				this.router.route(url, {scrollTop : this.oScrollTop});

				e.preventDefault();

				return false;
			},

			availableHeight : function () {
				// add up fixed-flex heights to determine available space
				// [data-flex-height="fixed"]
				if (!this.$flexheights) {
					this.$flexheights = $('[data-flex-height="fixed"]');
				}

				var i = this.$flexheights.length - 1,
					h = 0,
					winH = win.height();

				for (i; i >= 0; i--) {
					h += this.$flexheights.eq(i).outerHeight(true);
				}

				this.hudHeight = h;

				return (winH - h);
			},

			onImagesLoaded : function ($images, $proper, $broken) {
				var i = $broken.length - 1, // if any images aren't loaded try reloading them
					src,
					reload = function (i, src) {
							this.setTimeout(function () {
								$broken.eq(i).attr("src", src);
							}, 20);
						};

				for (i; i >= 0; i--) { // try reloading any broken images
					src = $broken.eq(i).attr("src");
					$broken.eq(i).attr("src", ""); // blank
					reload.call(this, i, src);
				}

				this.onResizeDebounce();
			},

			onResize : function (e) {
				var pW = this.$feature.width(),
					aH = this.availableHeight(),
					oH = 65 + this.$breadcrumb.height(); // offset height

				this.$container.css("min-height", aH + 80);

				this.$image.css({
					"max-height": Math.max(this.minHeight, aH - 65),
					"max-width": Math.max(this.minWidth, pW - this.controlsOffset) // 134 is enough space for left right arrows
				});

				// console.log("resize troubles debouncing 5");
				// this.$main.css("height", "");
				/*this.setTimeout(function () {
					this.$main.css({
						height : this.dom.height() + 50, // 110 is the header + footer
						overflow : "hidden"
					});
				}, 20);*/

				/*
				if (oH > 90) {
					this.dom.css("top", oH);
				}
				*/
			},

			destroy : function () {
				this.dom.remove();

				if (this.flip) {
					this.flip.destroy();
					this.flip = null;
				}

				this.removeListeners();
				this.dom.remove();
				this.sup();
			}
		});
	}
);
