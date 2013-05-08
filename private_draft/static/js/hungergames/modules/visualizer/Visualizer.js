define(

	[
		"rosy/base/Class",
		"jsonFile!hungergames/data/visualizer.json",
		"hungergames/utils/HBSHelpers",
		"hungergames/templates/tweet",
		"rosy/utils/Utils",
		"canvas2image",
		"$",
		"rosy/polyfills/request-animation-frame",
		"$plugin!transit"
	],

	function (Class, images, hbs, tweetTemplate, Utils, c2m, $) {

		"use strict";

		// Intentionally over-complicated and obfuscitated. Trying to make it harder to figure out by doing weird things.
		var a = [
				"x",
				"i",
				"4",
				"1",
				"0",
				"3",
				"y",
				"p",
				"u",
				"q"
			],
			SPEED = 1,
			MAX_SPEED = 1,
			LEGEND = a[0] + a[9] + a[4] + a[3] + a[2] + a[8] + a[6] + a[7] + a[5] + a[1],
			BLOCK_SIZE = 25,
			DOWNLOAD = false,
			$window = $(window);

		function decrypt(a, i, b) {
			b = "";
			for (i = 0; i < a.length; i ++) {
				b = b + LEGEND.indexOf(a[i]);
			}
			return parseInt(b, 10);
		}

		function rand(a) {
			return ((Math.random() * 2) - 1) * Math.random() * a;
		}

		return Class.extend({

			$el : null,
			$canvas : null,
			$revealCanvas : null,
			$thumbs : null,
			$tweet : null,

			canvas : null,
			context : null,

			image : null,

			imgCanvas : null,
			imgContext : null,

			scaledCanvas : null,
			scaledContext : null,

			loaded : false,

			x : 0,
			y : 0,

			width : 0,
			height : 0,
			scale : 0,

			size : 1,
			rafTimer : null,

			tweets : null,
			currentTweet : null,

			init : function (el) {

				var i,
					unlocked,
					img = new Image();

				this.$el = $(el);
				this.$thumbs = this.$el.find(".thumbs");
				this.$tweet = this.$el.find(".tweet");

				this.t = decrypt(this.$el.data("t"));

				this.canvas = document.createElement("canvas");
				this.context = this.canvas.getContext("2d");

				this.imgCanvas = document.createElement("canvas");
				this.imgContext = this.imgCanvas.getContext("2d");

				this.scaledCanvas = document.createElement("canvas");
				this.scaledContext = this.scaledCanvas.getContext("2d");

				this.$canvas = $(this.canvas);
				this.$revealCanvas = $(this.scaledCanvas);
				this.$revealCanvas.addClass("img");
				this.$el.prepend(this.$canvas);

				this.loadTweets();

				img.onload = this.onImgLoaded;
				this.img = img;

				this.$thumbs.on("click", "li", this.onThumbClick);

				unlocked = this.$thumbs.find("li[data-src]");

				$(unlocked[unlocked.length - 1]).trigger("click");

				$window.on("resize", this.onResize);

				this.$revealCanvas.on("click", this.onCanvasClick);
				this.$canvas.on("click", this.onCanvasClick);
			},

			loadTweets : function () {

				$.getJSON('/teasertweets', this.proxy(function (data) {
					this.tweets = data.statuses;
					this.recalc();
				})).fail(this.proxy(function () {
					this.tweets = [];
					this.recalc();
				}));
			},

			recalc : function () {

				if (!this.loaded || !this.tweets) {
					return;
				}

				var x,
					y,
					i,
					img,
					scale,
					offset,
					offsets = this.image.offsets,
					pixels,
					numCols = Math.ceil(this.img.width / BLOCK_SIZE),
					numRows = Math.ceil(this.img.height / BLOCK_SIZE),
					numBlocks = numCols * numRows;

				if (MAX_SPEED >= 10) {
					this.$el.prepend(this.$revealCanvas);
					this.$revealCanvas.removeClass("fade");
					this.setTimeout(function () {
						//this.$revealCanvas.css("display", "block");
						this.$revealCanvas.addClass("fade");
					}, 100);
				}


				img = this.img;

				this.$tweet.removeClass("active");

				this.context.clearRect(0, 0, this.width, this.height);
				this.imgContext.clearRect(0, 0, this.imgCanvas.width, this.imgCanvas.height);
				this.scaledContext.clearRect(0, 0, this.width, this.height);

				this.width = this.canvas.width = this.scaledCanvas.width = this.$el.width();
				this.height = this.canvas.height = this.scaledCanvas.height = this.$el.height();

				this.imgCanvas.width = img.width;
				this.imgCanvas.height = img.height;

				for (y = 0; y < numRows; y ++) {

					for (x = 0; x < numCols; x ++) {

						i = (y * numCols) + x;
						offset = offsets[i];

						this.imgContext.drawImage(img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, decrypt(offset[0]), decrypt(offset[1]), BLOCK_SIZE, BLOCK_SIZE);
					}
				}

				scale = Math.round(Math.max(this.width / img.width, this.height / img.height) * 100) / 100;

				this.x = Math.round((this.width - (img.width * scale)) * 0.5);

				//this.y = Math.round((this.height - (img.height * scale)) * 0.5);
				this.y = 0;

				this.scaledContext.drawImage(this.imgCanvas, 0, 0, img.width, img.height, this.x, this.y, img.width * scale, img.height * scale);

				this.scale = scale;
				this.pixels = this.scaledContext.getImageData(0, 0, this.width, this.height).data;

				for (i = 0; i < this.tweets.length; i++) {
					this.tweets[i].x = ~~((this.width - 200) * Math.random());
					this.tweets[i].y = ~~((this.height - 200) * Math.random());
				}

				if (!this.rafTimer) {
					this.render();
				}
			},

			draw : function (x, y, r, p) {
				var grad = this.context.createRadialGradient(x, y, r * (0.5 + 0.25 * p), x, y, r);
				grad.addColorStop(0, this.getRGBA(x, y, 1));
				grad.addColorStop(1, this.getRGBA(x, y, 0));
				this.context.fillStyle = grad;
				this.context.beginPath();
				this.context.moveTo(x, y);
				this.context.arc(x, y, r, 0, Math.PI * 2);
				this.context.fill();
			},

			render : function () {

				var i, j, r, w, h, x, y;

				for (j = 0; j < SPEED; j ++) {
					this.size = this.size * 0.97;
					if (this.size < this.minSize) {
						this.size = this.minSize;
					}
					this.context.globalAlpha = 0.4 - (this.size * 0.35);
					r = 4 + (500 * this.size);
					w = this.width * 0.5;
					h = this.height * 0.5;
					for (i = 0; i < (1 - this.size) * 20; i++) {
						x = w + rand(w * 1.3);
						y = h + rand(h * 1.3);
						this.draw(x, y, r, this.size);
					}
				}
				SPEED = Math.min(SPEED + 0.25, MAX_SPEED);
				this.rafTimer = window.requestAnimationFrame(this.render);
			},

			onImgLoaded : function () {
				this.loaded = true;
				this.recalc();
			},

			onResize : function () {
				if (this.rafTimer) {
					window.cancelAnimationFrame(this.rafTimer);
					this.rafTimer = null;
					this.size = 1;
				}
				this.recalc();
			},

			onThumbClick : function (e) {

				var i,
					diff,
					currDiff,
					$target = $(e.currentTarget),
					img,
					start,
					end,
					now,
					data = $target.data();


				if (data.src) {

					img = images[parseInt(data.index, 10)];

					if (this.image !== img) {

						if (this.$currThumb) {
							this.$currThumb.removeClass("selected");
						}

						this.$currThumb = $target;
						$target.addClass("selected");

						this.size = 1;
						SPEED = 1;

						start = decrypt(img.s, 10);
						end = decrypt(img.e, 10);

						diff = end - start;
						currDiff = this.t - start;

						if (currDiff >= diff) {
							MAX_SPEED = 10;
							this.minSize = 0.0000000000000000001;
						}

						else {
							MAX_SPEED = 1;
							this.minSize = 0.2 - ((currDiff / diff) * 0.24);
							if (this.minSize < 0) {
								this.minSize = 0.00001;
							}
						}

						//this.$revealCanvas.css("display", "none");
						this.$revealCanvas.removeClass("fade");
						this.$revealCanvas.detach();

						this.image = img;
						this.loaded = false;
						this.img.src = data.src;
					}
				}
			},

			onCanvasClick : function (e) {

				if (DOWNLOAD) {
					c2m.saveAsJPEG(this.canvas);
					return;
				}

				if (!this.tweets.length) {
					return;
				}

				var i,
					t,
					x = e.pageX,
					y = e.pageY - 55,
					prox = 9999999,
					tweet,
					currProx;

				for (i = 0; i < this.tweets.length; i++) {

					t = this.tweets[i];

					currProx = this.distance(t.x, x, t.y, y);
					if (currProx < prox) {
						tweet = t;
						prox = currProx;
					}
				}

				if (this.currentTweet === tweet) {
					return;
				}

				this.$tweet.html(tweetTemplate({tweet : tweet}));

				this.$tweet.removeClass("light dark callout hide").addClass("active " + this.lightOrDark(x, y)).css({
					top : Math.min(this.height, Math.max(125, y)),
					left : Math.min(this.width - 200, Math.max(200, x))
					//'background' : this.getRGBA(x, y, 0.7)
				});
			},

			distance : function (xa, xb, ya, yb) {
				var x = xa - xb,
					y = ya - yb;
				return x * x + y * y;
			},

			lightOrDark : function (x, y) {

				var rgb = this.getRGB(x, y);

				if (rgb[0] + rgb[1] + rgb[2] > 380) {
					return "light";
				}

				return "dark";
			},

			getRGB : function (x, y) {
				if (!this.pixels) {
					return [0, 0, 0, 0];
				}
				var xi = ~~Math.min(this.width, Math.max(0, x)),
					yi = ~~Math.min(this.height, Math.max(0, y)),
					i = (xi + (yi * this.width)) * 4;
				i = Math.min(this.pixels.length - 4, Math.max(0, i));
				return [this.pixels[i], this.pixels[i + 1], this.pixels[i + 2], this.pixels[i + 3]];
			},

			getRGBA : function (x, y, a) {
				var data = this.getRGB(x, y);
				return "rgba(" + data[0] + ", " + data[1] + ", " + data[2] + ", " + (~~(data[3] * a) / 255) + ")";
			}


		});
	}
);
