define(
	[
		"rosy/modules/Module",
		"$",
		"lodash"
	],

	function (Module, $, lodash) {

		"use strict";

		var win = $(window),
			EVENTS = {
				"down" : "mousedown MSPointerDown",
				"move" : "mousemove MSPointerMove",
				"up" : "mouseup MSPointerUp"
			};

		return Module.extend({

			"static" : EVENTS,

			isOn : false,

			startOffsetX : 0,
			startOffsetY : 0,

			startX : 0,
			startY : 0,

			x : 0,
			y : 0,

			deltaX : 0,
			deltaY : 0,

			init : function ($hitArea, callBack) {
				this.$hitArea = $hitArea;
				this.callBack = callBack; // pass data to the callback
				this.addListeners();
			},

			onResizeDebounce : null,
			onResize : function (e) {
				// stub intended for overwrite
			},

			addListeners : function () {
				this.$hitArea.on(EVENTS.down, this.onPointerDown);

				win.on(EVENTS.move, this.onPointerMove);
				win.on(EVENTS.up, this.onPointerUp);

				this.onResizeDebounce = lodash.debounce(this.onResize, 20);
				win.on("resize", $.proxy(this.onResizeDebounce, this));
			},

			removeListeners : function () {
				this.$hitArea.off(EVENTS.down, this.onPointerDown);
				win.off("resize", $.proxy(this.onResizeDebounce, this));
				win.off(EVENTS.move, this.onPointerMove);
				win.off(EVENTS.up, this.onPointerUp);
			},

			onPointerDown : function (e) {
				this.startX = this.x = e.originalEvent.pageX;
				this.startY = this.y = e.originalEvent.pageY;

				this.startOffsetX = e.originalEvent.offsetX || e.originalEvent.layerX;
				this.startOffsetY = e.originalEvent.offsetY || e.originalEvent.layerY;

				this.isOn = true;

				// this.onPointerMove(e);
			},

			onPointerUp : function (e) {
				if (!this.isOn) {
					return false;
				}

				this.removeListeners();
				this.addListeners();

				this.isOn = false;
				// e.preventDefault();
			},

			onPointerMove : function (e) {
				if (!this.isOn) {
					return false;
				}

				var x = e.originalEvent.pageX,
					y = e.originalEvent.pageY;

				this.deltaX = x - this.x; // movement since last touch point
				this.deltaY = y - this.y;

				this.distX = x - this.startX; // total distance from touch point
				this.distY = y - this.startY;

				this.x = x;
				this.y = y;

				// e.preventDefault();
			},


			destroy : function () {
				this.removeListeners();
				this.sup();
			}

		});
	}
);
