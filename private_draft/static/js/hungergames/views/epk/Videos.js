define(

	[
		"./base/Base",
		"$",
		"$plugin!transit",
		"lodash",
		"../../modules/YoutubePlayer"
	],

	function (Base, $, $transit, lodash, YoutubePlayer) {

		"use strict";

		var win = $(window),
			body = $("html, body");

		return Base.extend({

			$main : null,
			$cover : null, // cover over main video
			$list : null, // list of videos
			$title : null, // title of currently playing video

			$loader : null,
			$container : null,
			$player : null,
			$frame : null,

			$controls : null,

			ytplayer : null,

			index : 0,

			init : function () {

			},

			load : function () {
				this.dom = $("#modal");
				this.$main = $("#main");

				this.ytplayer = new YoutubePlayer(); // instantiate before the iframe loads

				this.loadComplete();
			},

			loadComplete : function () {
				this.$title = this.dom.find(".section-title h1");

				this.$loader = this.dom.find(".loader");
				this.$container = this.dom.find(" > .container");
				this.$player = this.dom.find("#video");
				this.$frame = this.dom.find(".frame");
				this.$cover = this.dom.find(".video .cover");


				this.$closeBtn = this.dom.find(".close");
				this.$controls = this.dom.find(".frame .controls");
				this.$list = this.dom.find(".thumbnails a");

				this.sup();
			},

			update : function (params, data) {
				this.getCurrentVideo(params.slug);
			},

			getCurrentVideo : function (slug) {
				var $targ = this.$list.filter('[data-slug="' + slug + '"]'),
					data = $targ.data();

				this.$player.data("slug", slug);

				this.$cover
					.addClass("active")
					.transition({
						opacity: 1,
						duration : "400ms",
						delay : "0ms",
						easing : "easeInOutQuad",
						complete : $.proxy(function () {
							this.$title.text($targ.attr("title"));
							this.$player.html(data.embed);
							this.onVideoReady();
						}, this)
					});

				// activate thumbnail
				this.$list.removeClass("active");
				$targ.addClass("active");

				body.animate({
					scrollTop: 0
				}, 500);
			},

			addListeners : function () {
				this.$list.on("click", $.proxy(this.onClickVideoThumb, this));
				this.$controls.on("click", $.proxy(this.onClickNext, this));

				if (this.data.history) { // temporary fix, need to handle with historyPush later
					this.$closeBtn.on("click", this.onClose);
				}

				this.subscribe(YoutubePlayer.FIRST_PLAY, this.onFirstPlay);

				win.on("resize", $.proxy(this.onResize, this));
			},

			onFirstPlay : function (n, event, vid) {
				// track the CF Trailer plays
				if (vid === "VaC3xDcZmBE") { // http://www.youtube.com/watch?feature=player_embedded&v=VaC3xDcZmBE
					var img = new Image(); // playing
					img.src = 'http://view.atdmt.com/action/SMG_MRTINX_CF_Trailer_VideoPlay';
				}
			},

			removeListeners : function () {
				this.$list.off("click", $.proxy(this.onClickVideoThumb, this));
				this.$closeBtn.off("click", this.onClose);

				this.unsubscribe(YoutubePlayer.FIRST_PLAY, this.onFirstPlay);

				win.off("resize", $.proxy(this.onResize, this));
			},

			onClose : function (e) {
				var url = $(e.currentTarget).attr("href");

				this.router.route(url);

				e.preventDefault();

				return false;
			},

			onClickNext : function (e, $nextTarg) {
				var targ = $(e.currentTarget),
					isNext = targ.hasClass("next"),
					direction = (isNext) ? 1 : -1,
					total = this.$list.length - 1,
					index = this.index + direction;

				this.index = (index < 0) ? total : (index > total) ? 0 : index;

				this.$list.eq(this.index).trigger("click");
			},

			onClickVideoThumb : function (e) {
				var url = $(e.currentTarget).attr("href");
				this.router.route(url, {history : true});
				return false;
			},

			onVideoReady : function (e) {
				// consider replacing with a "flip"
				this.onResize();

				this.$player.transition({
					opacity: 1,
					duration : "400ms",
					delay : "0ms",
					easing : "easeInOutQuad"
				});

				this.$cover.transition({
					opacity: 0,
					duration : "400ms",
					delay : "0ms",
					easing : "easeInOutQuad",
					complete : $.proxy(this.onRevealVideo, this)
				});

				this.ytplayer.update(this.$player);

				this.setSelectedPagination();

			},

			onRevealVideo : function () {
				this.$cover.removeClass("active");
			},

			setSelectedPagination : function (e, vSlug) {
				var selected;

				vSlug = vSlug || this.$player.data("slug");

				this.$list.removeClass("active");
				selected = this.$list.filter('[data-slug="' + vSlug + '"]').eq(0).addClass("active");
				this.index = selected.parent().index();
			},

			transitionIn : function () {
				this.onResize();

				this.sup();
				this.$container.transition({ // transition in page
					opacity : 1,
					easing : "easeInOutQuad",
					duration : "500ms",
					delay : "20ms",
					complete : this.transitionInComplete
				});
			},

			transitionInComplete : function () {
				this.onVideoReady(); // spoof it since we're not sure if using youtube
				this.addListeners();

				this.sup();
			},

			transitionOut : function () {
				this.$container.transition({ // transition in page
					opacity : 0,
					easing : "easeInOutQuad",
					duration : "500ms",
					delay : "20ms",
					complete : this.transitionOutComplete
				});
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

				return (winH - h);
			},

			onResize : (function () {

				return (lodash.debounce(function (e) {
					this.setTimeout(function () {
						var pW = this.$frame.width() - 120,
							aH = this.availableHeight() - 110,
							w = this.$player.width(),
							h = this.$player.height(),
							rW = w / h,
							rH = h / w,
							w1 = (pW * rH > aH) ? aH * rW : pW,
							h1 = w1 * rH;


						this.$player.css({
							width : w1,
							height : h1
						});

						this.$player.find("iframe").css({
							width : "100%",
							height : "100%"
						});

						this.$main.css({
							height : Math.max(this.dom.height() + 110, win.height()), // 110 is the header + footer
							overflow : "hidden"
						});

						// update overlay to max height
						this.$container.css("min-height", aH + 120);

					}, 20);

				}, 20));
			})(),

			destroy : function () {
				this.ytplayer.destroy();
				this.ytplayer = null;

				this.removeListeners();
				this.$cover = null;
				this.$list = null;

				this.dom.remove();

				this.sup();
			}
		});
	}
);
