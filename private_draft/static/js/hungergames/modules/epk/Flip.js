define(
	[
		"./Gesture",
		"$",
		"../../math/vec2",
		"rosy/polyfills/request-animation-frame",
		"lodash"
	],

	function (Gesture, $, vec2, raf, lodash) {

		"use strict";

		/*global Modernizr */

		var win = $(window),
			DEG_OVER_RAD = 180 / Math.PI,
			WIDTH = win.width(),
			transform = Modernizr.prefixed("transform"); // requires Modernizr.prefixed

		return Gesture.extend({
			$back : null,


			$hitArea : null,
			$source : null,
			$target : null,

			gesture : {
				x : {
					min : 0,
					max : 400,
					distance : 400
				} // movement boundary indacting a complete gesture
			},

			card : {
				x : {
					min : 0,
					max : 0,
					distance : 0,
					offset : 0
				}
			},

			// backface animation from large area to arrow-button
			back :  {
				width : {
					min : 0,
					max : 60
				},

				height : {
					min : 0,
					max : 60
				},

				top : {
					min : 0,
					max : 50
				},

				left : {
					min : 0,
					max : 50
				},

				style : {} // set during the "calculate" pass
			},

			// affected properties
			props : {
				rotateY : 0,
				x : 0
			},

			easing : {
				strength : 0.1, //
				rotateY : 0,
				x : 0
			},

			init : function ($hitArea, $source, $target) {
				this.$hitArea = $hitArea;
				this.$source = $source;
				this.$target = $target;

				this.$back = this.$target.find(".back");

				this.addListeners();
			},

			addListeners : function () {
				this.sup();
				win.on("resize", $.proxy(this.onResize, this));
			},

			removeListeners : function () {
				this.sup();
				win.off("resize", $.proxy(this.onResize, this));
			},

			onResize : (function () {
				return (lodash.debounce(function (e) {
					this.setupBoundaries();
				}, 20));
			})(),

			setupBoundaries : function () {
				WIDTH = win.width(); // window size for perspective

				var parentW = $(".slideshow").width() - $(".slideshow .controls").width(),
					parentH = $(".slideshow").height() - $(".slideshow .controls").height(),
					w = this.$source.outerWidth(true),
					h = this.$source.outerHeight(true),
					l = this.$source.position().left;

				this.gesture.x.max = (parentW / 2); // gesture distance based on distance from center to left arrow
				this.distance(this.gesture.x); // gesture boundary distance

				this.card.x.max = (parentW / 2); // card travel distance based on distance from center to left side
				this.card.x.offset = l;
				this.distance(this.card.x); // card boundary

				// setup the animated card
				this.$target.css({
					width : w,
					height : h
				});

				// setup back boundaries
				this.back.width.min = w;
				this.distance(this.back.width);

				this.back.height.min = h;
				this.distance(this.back.height);

				this.back.top.max = (parentH / 2); // pixels
				this.distance(this.back.top);

				this.back.left.max = (parentW / 2); // pixels
				this.distance(this.back.left);
			},

			distance : function (obj) {
				obj.distance = obj.min - obj.max;
			},

			start : function () {
				this.setupBoundaries();

				this.shouldStop = false;
				this.forceStop = false;
				this.calculate(0);
				this.update();

				this.$hitArea = this.$target; // temporary
				this.$source.css({ // clone cover over the current source position absolute
					opacity: 0
				});

				this.$target.removeClass("hidden"); // initial setup
			},

			stop : function (forceStop) {
				this.shouldStop = true; // raf will stop when ready
				this.forceStop = forceStop;
			},

			// calculate positions
			calculate : function (perc) {
				this.props.perc = perc;

				this.props.x = this.card.x.offset + (this.card.x.distance * perc);
				this.props.rotateY = 180 * perc;

				// animate back face
				this.back.style = {
					width : (this.back.width.min - ((this.back.width.min - this.back.width.max) * Math.abs(perc))) + "px",
					height : (this.back.height.min - ((this.back.height.min - this.back.height.max) * Math.abs(perc))) + "px",
					top : (this.back.top.min - ((this.back.top.min - this.back.top.max) * Math.abs(perc))) + "px"
				};
			},


			update : function (time) {
				if (this.forceStop) { // stop update
					return false;
				}

				///////////////////////////////////
				// flipping and position of card
				this.updateMoveCard();

				///////////////////////////////////
				// backface animation
				this.updateBackFace();

				if (!this.shouldStop) {
					return raf(this.update); // loop
				} else {
					var p = this.props.perc * 100,
						perc = p + ((this.finish - p) * 0.1);

					if (Math.round(perc) !== Math.round(this.props.perc)) { // let easing finish
						this.calculate(perc / 100);
						return raf(this.update);
					}
				}
			},

			completeMotion : function () {

			},

			updateMoveCard : function () {
				///////////// Card position + rotation
				this.easing.rotateY += (this.props.rotateY - this.easing.rotateY) * this.easing.strength;
				this.easing.x = this.props.x;

				var trans = [
					"translateX(" + this.easing.x + "px)",
					"rotateY(" + this.easing.rotateY + "deg)"
				];

				this.$target[0].style[transform] = trans.join(" ");

				///////////// Backface visibility toggling
				// this.easing.isFrontShowing = ((Math.abs(this.easing.rotateY) + 90) % 360 < 180); // flip front and back
				var tan = vec2.create(),
					rot = vec2.create(),
					rad = this.easing.rotateY / DEG_OVER_RAD,
					xFromCenter = (WIDTH / 2) - this.easing.x, // margin?
					zFromCamera = -(0 - 3000),
					isFront;

				vec2.set(tan, xFromCenter, zFromCamera);
				vec2.normalize(tan, tan);
				vec2.set(rot, Math.sin(rad), Math.cos(rad));

				isFront = vec2.dot(tan, rot) > 0;

				if (isFront !== this.props.isFrontShowing) {
					this.$target.toggleClass("back", !isFront);
					this.props.isFrontShowing = isFront;
				}
			},

			updateBackFace : function () {
				var i;

				// this.$back[0].style[transform] = this.back.transform.join(" ");

				for (i in this.back.style) {
					this.$back[0].style[i] = this.back.style[i];
				}
			},

			onPointerDown : function (e) {
				this.sup.apply(this, arguments);
				this.start();
				this.calculate(0);
			},

			onPointerUp : function (e) {
				this.sup.apply(this, arguments);
				// animate the gesture percentage then stop$.animate
				var p = this.props.perc;

				this.finish = 100 * ((p > 0.5) ? 1 : (p < -0.5) ? -1 : 0);

				this.stop();
			},

			onPointerMove : function (e) {
				this.sup.apply(this, arguments);

				var dX = (this.x - this.startX), // current gesture distance
					perc = Math.max(-1, Math.min(1, dX / this.gesture.x.distance)); // percentage of gesture completed

				this.calculate(perc);
			},

			destroy : function () {
				this.stop(true);
				this.removeListeners();
				this.sup();
			}

		});
	}
);
