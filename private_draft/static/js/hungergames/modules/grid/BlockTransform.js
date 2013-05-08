/*jshint bitwise:false*/
define(

	[
		"rosy/base/Model",
		"$",
		"../../utils/Easing",
		"../../math/vec2",
		"../../math/vec3"
	],

	function (Class, $, Easing, vec2, vec3) {

		"use strict";

		/*global Modernizr */

		var DEG_OVER_RAD = 180 / Math.PI,
			transform = Modernizr.prefixed("transform"); // requires Modernizr.prefixed

		return Class.extend({

			dom : $(),
			detail : $(),

			block : null,

			init : function () {
				this.sup();

				this.targetPosition = vec3.create();
				this.position = vec3.create();
				this.lastPosition = vec3.create();
				this.gestureStartPosition = vec3.create();
				this.gestureEndPosition = vec3.create();

				this.backfaceTangent = vec2.create();
				this.backfaceRotation = vec2.create();
			},

			/************************************
				Global Width
			************************************/

			gWidth : 0,
			gHeight : 0,

			setGlobalWidthHeight : function (width, height) {
				this.gWidth = width;
				this.gHeight = height;
				this.updateState();
			},

			width : 0,
			height : 0,
			setWidthHeight : function (width, height) {
				this.height = height;
				this.width = width;
				this.updateState();
			},

			/************************************
				Row / Column
			************************************/

			row : 0,
			col : 0,

			setRowCol : function (row, col) {
				this.row = row;
				this.col = col;
				this.updateState();
			},

			/************************************
				State
			************************************/

			state : "m",

			updateState : function () {
				switch (this.state) {
				case "m":
					this.moveToMid();
					break;
				case "b":
					this.moveToBack();
					break;
				case "f":
					this.moveToFront();
					break;
				}
			},

			snapToTarget : function () {
				this.updateState();
				vec3.copy(this.position, this.targetPosition);
			},

			moveToInitial : function () {
				var sign = this.row < 0.5 ? -1 : 1;
				this.position[0] = ~~((this.row + sign) * this.gWidth);
				this.position[1] = ~~(this.col * this.gWidth) + 10;
				this.position[2] = 0;
			},

			moveToDetached : function () {
				var sign = this.row < 0.5 ? -1 : 1;
				this.targetPosition[0] = ~~((this.row + sign) * this.gWidth);
				this.targetPosition[1] = ~~(this.col * this.gWidth) + 10;
				this.targetPosition[2] = 0;
			},

			moveToMid : function () {
				this.targetPosition[0] = ~~(this.row * this.gWidth);
				this.targetPosition[1] = ~~(this.col * this.gWidth) + 10;
				this.targetPosition[2] = 0;
				this.targetRotation = 0;
				this.frontPercentTarget = 0;
				this.state = "m";
			},

			moveToFront : function () {
				var sign = this.row < 0.5 ? -1 : 1;
				this.targetPosition[0] = ~~(this.gWidth / 2);
				this.targetPosition[1] = ~~(this.col * this.gWidth) + 10;
				this.targetPosition[2] = 0;
				this.targetRotation = 180 * sign;
				this.frontPercentTarget = 1;
				this.state = "f";
			},

			moveToBack : function (instant) {
				var sign = this.row < 0.5 ? -1 : 1;
				this.targetPosition[0] = ~~((this.row + sign) * this.gWidth);
				this.targetPosition[1] = ~~(this.col * this.gWidth) + 10;
				this.targetPosition[2] = -2000;
				// no offscreen if no 3d transforms
				if (!Modernizr.csstransforms3d) {
					this.targetPosition[0] = ~~((this.row + (sign * 0.33)) * this.gWidth);
					this.targetPosition[2] = 0;
				}
				this.targetRotation = 0;
				this.frontPercentTarget = 0;
				if (instant) {
					vec3.copy(this.position, this.targetPosition);
				}
				this.state = "b";
			},

			moveToGesture : function (percent) {
				vec3.lerp(this.targetPosition, this.gestureStartPosition, this.gestureEndPosition, percent);
				vec3.copy(this.position, this.targetPosition);
				this.targetRotation = this.rotation = Easing.lerp(this.gestureStartRotation, this.gestureEndRotation, percent);
				this.frontPercentTarget = this.isGoingToForeground ? percent : 1 - percent;
				this.state = "g";
			},

			moveToPrevious : function () {
				this.state = this.lastState || "m";
				this.updateState();
				this.frontPercent = this.frontPercentTarget;
			},

			/************************************
				Initial Delay
			************************************/

			delay : 0,
			setInitialDelay : function (d) {
				this.delay = d;
			},

			/************************************
				Dragging Gesture
			************************************/

			startX : 0,
			endX : 0,
			gestureStartPosition : null,
			gestureStartRotation : 0,
			gestureEndPosition : null,
			gestureEndRotation : 0,
			startGesture : function (x, y) {
				var halfWidth = this.gWidth / 2;
				this.startX = x;
				if (this.state !== "g") {
					this.lastState = this.state;
				}
				if (this.state === "f") {
					this.moveToBack();
					this.endX = halfWidth + (this.targetPosition[0] - halfWidth) / 3;
					this.isGoingToForeground = false;
				} else {
					this.moveToFront();
					this.endX = halfWidth;
					this.isGoingToForeground = true;
				}
				vec3.copy(this.gestureStartPosition, this.position);
				vec3.copy(this.gestureEndPosition, this.targetPosition);
				this.gestureEndRotation = this.targetRotation;
				this.gestureStartRotation = this.rotation;
				this.moveToGesture(x, y);
			},

			shouldGoToForeground : null,
			isGoingToForeground : null,
			lastPercent : 0,
			moveGestureToXY : function (x, y) {
				var percent = Easing.percent(this.startX, this.endX, x);
				if (percent < 0) {
					percent = Easing.lerp(percent, 0, 0.8);
				}
				if (percent > 1) {
					percent = Easing.lerp(percent, 1, 0.95);
				}
				percent = Easing.clamp(-0.2, 1.2, percent);
				this.moveToGesture(percent);
				if (this.lastPercent > percent) {
					this.shouldGoToForeground = !this.isGoingToForeground;
				}
				if (this.lastPercent < percent) {
					this.shouldGoToForeground = this.isGoingToForeground;
				}
				this.lastPercent = percent;
			},

			/************************************
				Update
			************************************/

			isDetached : function (delta) {
				this.moveToDetached();
				this.tick();
				if (vec3.squaredDistance(this.position, this.targetPosition) < 3) {
					return true;
				}
			},

			tick : function (delta) {
				if (this.isOneColumn) {
					return;
				}
				if (this.delay > 0) {
					this.delay = this.delay - delta;
				} else {
					this.update(delta);
				}
				this.render();
			},

			rotation : 0,
			targetRotation : 0,
			position : null,
			targetPosition : null,
			frontPercent : 0,
			frontPercentTarget : 0,

			update : function (delta) {
				var posDiff = vec3.squaredDistance(this.position, this.targetPosition),
					rotDiff = Math.abs(this.rotation - this.targetRotation),
					frontDiff = Math.abs(this.frontPercent - this.frontPercentTarget),
					count = delta;

				if (posDiff < 1 && rotDiff < 1 && frontDiff < 1) {
					vec3.copy(this.position, this.targetPosition);
					this.rotation = this.targetRotation;
					this.frontPercent = this.frontPercentTarget;
					return;
				}

				// we loop here in order to normalize slow framerates to end
				// the animation in the same amount of time
				count = delta / 16;
				do {
					count--;
					vec3.lerp(this.position, this.position, this.targetPosition, 0.2);
					this.rotation = Easing.lerp(this.rotation, this.targetRotation, 0.2);
					this.frontPercent = Easing.lerp(this.frontPercent, this.frontPercentTarget, 0.2);
				} while (count > 0);
			},

			lastPosition : 0,
			lastRotation : 0,
			render : function (force) {
				var posDiff = vec3.squaredDistance(this.position, this.lastPosition),
					scroll = Easing.lerp(0, this.scrollList, this.frontPercent),
					rotDiff = Math.abs(this.rotation - this.lastRotation);

				this.lastRotation = this.rotation;
				vec3.copy(this.lastPosition, this.position);

				if (posDiff < 0.1 && rotDiff < 0.1 && !force) {
					return;
				}

				this.updateBackfaceVisibility(force);

				if (this.isFront) {
					this.transform(this.dom, 0, 0);
				} else {
					this.transform(this.detail, 180, this.position[1]);
				}
			},

			transform : function (dom, rotation, scroll) {
				var p = this.position,
					r = this.rotation + rotation;

				if (Modernizr.csstransforms3d) {
					dom[0].style[transform] = "translate3d(" + ~~p[0] + "px, " + ~~(p[1] - scroll) + "px, " + ~~p[2] + "px) rotateY(" + r + "deg)";
				} else {
					dom.css({
						left: ~~p[0],
						top: ~~(p[1] - scroll)
					});
					if (transform) {
						dom[0].style[transform] = "scale(" + Math.cos(r / DEG_OVER_RAD) + ', 1)';
					}
				}
			},

			backfaceTangent : null,
			backfaceRotation : null,

			isFront : null,
			isOneColumn : null,

			updateBackfaceVisibility : function (force) {
				var dot,
					rad = this.rotation / DEG_OVER_RAD,
					xFromCenter = (this.gWidth / 2) - this.position[0],
					zFromCamera = -(this.position[2] - 1000),
					wasFront = this.isFront;

				vec2.set(this.backfaceTangent, xFromCenter, zFromCamera);
				vec2.normalize(this.backfaceTangent, this.backfaceTangent);
				vec2.set(this.backfaceRotation, Math.sin(rad), Math.cos(rad));

				this.isFront = vec2.dot(this.backfaceTangent, this.backfaceRotation) > 0;

				// this.updateBlockAppended();

				// don't show/hide the element if the value hasn't changed
				if (wasFront === this.isFront && !force) {
					return;
				}
				if (this.isFront) {
					this.dom.removeClass('hidden');
					this.detail.detach();
				} else {
					this.dom.addClass('hidden');
					this.block.grid.detail.append(this.detail);
				}
			},

			detach : function () {
				this.dom.detach();
				this.detail.detach();
				this.isOffScreen = null;
				this.blockIsAppended = null;
				this.isFront = null;
				this.isOffScreen = null;
				this.mgInitialOffset = 2000;
			}

		});
	}
);
