define(
	[
		"./Gesture",
		"$",
		"../../math/vec2",
		"rosy/polyfills/request-animation-frame",
		"lodash",
		"$plugin!easing"
	],

	function (Gesture, $, vec2, raf, lodash, $easing) {

		"use strict";

		/*global Modernizr */

		var win = $(window),
			doc = $(document),

			transform = Modernizr.prefixed("transform"), // requires Modernizr.prefixed
			backgroundPosition = Modernizr.prefixed("backgroundPosition"), // backgroundPosition
			transformOrigin = Modernizr.prefixed("transformOrigin"),

			EVENTS = {
				CHANGE_ROUTE : "slideshow/change-route"
			};

		return Gesture.extend({

			"static" : EVENTS,

			$target : null,
			$cover : null,
			$list : null,
			$controls : null,
			$title : null,

			$blinds : null,

			$number : 1,

			index : 0,
			total : 0,
			image : null,

			gestureWidth : 0,

			easing : 0,

			gestureEasing : 0.4, // easing while tracking gesture
			percent : 0,
			percEased : 0,
			gesturePerc : 0,

			direction : 0,
			directionChange : 0,

			url : null,

			divisions : 10,
			divisionPerc : 0, // calculated automatically

			revert : null,

			rotationBoundary : 90,
			rotation : 0,

			shouldStopAutoCycle : false,

			init : function ($hitArea, callBack) {
				this.$hitArea = $hitArea.find(".gesture");

				this.$target = $hitArea;
				this.$cover = this.$target.find(".items");
				this.$list = this.$cover.find("a");
				this.total = this.$list.length;
				this.divisionPerc = 100 / this.divisions;

				this.$controls = this.$target.find("a.controls");
				this.$title = this.$target.find(".details h1");

				this.$number = this.$target.find(".pagination span");

				this.index = this.$target.data("index") || 0;

				this.onResize();
				this.sup.apply(this, [this.$hitArea, callBack]);
			},

			makeBlinds : function () {
				if (Modernizr.csstransforms3d) {
					this.$blinds = $(new Array(1 + this.divisions).join("<b></b>"));
				} else {
					this.$blinds = $('<b class="full"></b>');
				}
			},

			addListeners : function () {
				this.$hitArea.on("click", $.proxy(this.onClick, this));
				this.$controls.on("click", $.proxy(this.onClickNext, this));
				this.sup();
			},

			removeListeners : function () {
				this.$hitArea.off("click", $.proxy(this.onClick, this));
				this.$controls.off("click", $.proxy(this.onClickNext, this));
				this.sup();
			},

			getNext : function (isNext) {
				this.onClickNext(null, isNext);
			},

			onClickNext : function (e, forceNext) {
				var isNext = (typeof forceNext === "undefined") ? $(e.currentTarget).hasClass("next") : !!forceNext; // bool

				if (e) {
					this.shouldStopAutoCycle = true;
				}

				this.direction = (isNext) ? -1 : 1;
				this.easing = 1;

				this.start();

				this.test = this.test || { value : 0 };
				this.test.value = 0;


				// animate the percent to fake the easing
				var that = this;
				$(this.test).stop().animate({ value: 100 }, {
					duration: 500,
					easing : "easeInOutCirc",
					step: function () {
						that.calculate(this.value / 100);
					},
					complete : $.proxy(function () {
						this.calculate(1);
						this.stop();
					}, this)
				});
			},

			onResize : function (e) {
				this.width = this.$hitArea.width(); //
				this.sup.apply(this, arguments);
			},

			/// setup the blinds
			onImageLoaded : function (e) {
				var nextTarg = this.$list.eq(this.index),
					size = this.$cover.data("size"),
					nextTitle = nextTarg.attr("title"),
					nextImg = nextTarg.data(size); // cur size

				// this.$cover.fadeIn();

				var cW = this.$cover.width(),
					cH = this.$cover.height(),
					cR = cW / cH,
					w = this.image.width || cW,
					h = this.image.height || cH,
					r = w / h,
					total = this.divisions - 1,
					i = total, // image ratio
					bW, // blinds width
					diffW;

				if (cR < r) { // covering height
					h = cH;
					w = h * r;
				} else { // covering width
					w = cW;
					h = w / r;
				}


				bW = Math.round(cW / this.divisions);
				diffW = (bW * this.divisions) - cW;

				if (Modernizr.csstransforms3d) {
					for (i; i >= 0; i--) {
						this.$blinds[i].style[transformOrigin] = (this.direction < 0) ? "0% 0%" : "100% 0%";
						this.$blinds[i].style[backgroundPosition] = -((this.direction < 0) ? (total - i) : i) * bW + "px 0";
						this.$blinds[i].style.left = ((this.direction < 0) ? (total - i) : i) * bW + "px";

						if (i === total && this.direction > 0 || i === 0 && this.direction < 0) {
							this.$blinds[i].style.width = (bW - diffW) + "px";
						} else {
							this.$blinds[i].style.width = bW + "px";
						}
						// this.$blinds[i].style.zIndex = (this.divisions - i);
					}

					//
					this.$blinds.css({
						"background-image" : "url(" + this.image.src + ")",
						"background-size" : w + "px " + h + "px"
					});
				} else {
					this.$blinds.css({
						"background-image" : "url(" + this.image.src + ")"
					});
				}

				this.$target.css({
					"z-index" : "2"
				});


				if (this.nextImage) {
					this.nextImage.src = null;
				}


				this.$cover.css({
					"background-image" : "url(" + nextImg + ")"
				});
				/*this.nextImage = new Image();
				this.nextImage.onload = $.proxy(function () {
					this.$cover.css({
						"background-image" : "url(" + nextImg + ")"
					});
				}, this);
				this.nextImage.src = nextImg;*/

				this.$title.text(nextTitle);

				////////////////////////////////////
				this.calculate(0);
				this.update();
			},

			//
			start : function (e) {
				// don't start until you know the direction?
				if (this.$blinds) {
					this.$blinds.remove();
				}

				this.makeBlinds();

				this.shouldStop = false;
				this.forceStop = false;

				this.percEased = this.gesturePerc = 0;

				this.revert = $.extend(this.revert, {
					index : this.index,
					image : this.$cover.css("background-image"),
					title : this.$title.text()
				});

				//// setup
				this.$blinds.remove()
							.prependTo(this.$cover);

				this.index += -(this.direction);
				this.index = (this.index >= this.$list.length) ? 0 : (this.index < 0) ? this.$list.length - 1 : this.index;

				this.$target.data("index", this.index);
				this.$number.text(this.index + 1);

				// update to load smallest possible size
				var curImg = this.$cover.css("background-image");

				if (this.image) {
					this.image.src = null;
				}

				this.image = new Image();
				this.image.src = curImg.replace(/"/g, "").replace(/url\(|\)$/ig, ""); // http://stackoverflow.com/a/9576385/527096
				// this.image.onload = $.proxy(this.onImageLoaded, this); // start blind control once image has loaded (it should be cached)
				this.onImageLoaded();

			},

			stop : function (forceStop) {
				this.shouldStop = true; // raf will stop when ready
				this.forceStop = forceStop;
			},



			calculate : function (perc) {
				this.percent = perc;
			},

			calculateWithEasing : function () {
				var oscillate;

				this.percEased += (this.percent - this.percEased) * this.easing;
				this.segment = Math.floor(this.percEased * this.divisions);
				this.gesturePerc = (((this.percEased * 100) - (this.divisionPerc * this.segment)) / this.divisionPerc);
				this.opacity = 1 - Math.max(0, (this.percEased - 0.9)) * 10;

				oscillate = (this.segment % 2 === 0) ? 1 : -1;
				this.rotation = oscillate * (this.rotationBoundary * this.gesturePerc);

			},

			update : function (time) {
				if (this.forceStop) { // stop update
					return false;
				}

				this.calculateWithEasing();

				var i = this.$blinds.length - 1;
					// opacity = 0 * Math.max(0.5, this.percEased);

				if (!Modernizr.csstransforms3d) {
					this.$blinds[i].style.left = this.direction * (100 * this.percEased) + "%";
				} else {

					for (i; i >= 0; i--) {
						if (i < this.segment) {
							this.$blinds[i].style[transform] = "rotateY(180deg)";
							// this.$blinds[i].style.opacity = "0";
						} else if (i === this.segment) {
							this.$blinds[i].style[transform] = "rotateY(" + this.rotation + "deg)";
							//this.$blinds[i].style.opacity = this.opacity;
						} else {
							this.$blinds[i].style[transform] = "rotateY(0deg)";
							//this.$blinds[i].style.opacity = this.opacity;
						}
					}
				}

				if (!this.shouldStop) {
					return raf(this.update); // loop
				} else {
					this.percent = (this.percent >= 0.5) ? 1 : 0;
					if (Math.round(this.percEased * 100) !== Math.round(this.percent * 100)) {
						this.calculate(this.percent);
						return raf(this.update);
					}

					this.stopUpdate();
				}

				// halfway

				return false;
			},

			stopUpdate : function () {
				this.$blinds.remove(); // stop the raf
				this.$target.css("z-index", "1");

				if (this.image) {
					this.image.onload = this.image.src = this.image = null;
				}

				if (!this.percent) {
					this.revertIndex();
				}
			},

			// automatically go back to original state (not gestured far enough)
			revertIndex : function () {
				this.index = this.revert.index;
				this.$target.data("index", this.index);
				this.$cover.css("background-image", this.revert.image);
				this.$title.text(this.revert.title);
				this.$number.text(this.index + 1);
			},

			onPointerUp : function (e) {
				if (!this.isOn) {
					return false;
				}

				this.sup.apply(this, arguments);
				this.stop();
			},

			onClick : function (e) {
				if (!this.direction) {
					this.publish(EVENTS.CHANGE_ROUTE, this.$list.eq(this.index).attr("href"));
				}
			},

			onPointerDown : function (e) {
				this.stop(true);
				this.shouldStopAutoCycle = true;
				this.sup.apply(this, arguments);
				this.direction = this.directionChange = 0; // reset direction
				//this.start(e);
			},

			onPointerMove : function (e) {
				if (!this.isOn) {
					return false;
				}

				this.sup.apply(this, arguments);

				var dC,
					perc;

				if (this.direction === 0) { // undecided gesture direction
					if (this.distX > 0) { // moving right
						this.directionChange++;
					} else { // moving left
						this.directionChange--;
					}

					dC = Math.abs(this.directionChange);

					if (dC > 5) {
						this.direction = this.directionChange / dC; // -1 or 1
						this.gestureWidth = (this.direction < 0) ? this.startOffsetX : (this.$cover.width() - this.startOffsetX);
						this.easing = this.gestureEasing;
						this.start(e);
					}
				} else {
					perc = Math.max(0, Math.min(1, Math.abs(this.distX / this.gestureWidth))); // percentage of gesture completed
					this.calculate(perc);
				}
			},

			destroy : function () {
				this.stop(true);
				this.revert = null;
				this.sup.apply(this, arguments);
			}

		});
	}
);
