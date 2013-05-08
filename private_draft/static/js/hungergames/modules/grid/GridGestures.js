/*jshint bitwise:false*/
define(function (require, exports, module) {

	"use strict";

	var Class = require("rosy/base/Class"),
		rafBuffer = require("../../utils/RequestAnimationFrameBuffer"),
		$ = require("$"),
		OnePointerGesture = require("./OnePointerGesture"),
		ElasticScroll = require("../../utils/ElasticScroll"),
		$main = $('.main'),
		transform = Modernizr.prefixed("transform");

	module.exports = Class.extend({

		dom : null,

		windowHeight : 0,
		centerX : 0,
		centerY : 0,

		gestureOne : null,
		gestureMany : null,

		pointers : {},

		init : function (dom, detail, grid) {
			this.dom = dom;
			this.grid = grid;
			this.pointers = {};

			// scroll
			this.gestureOne = new OnePointerGesture(grid);

			$(window).on('keyup', this.onKeyUp);

			if (window.MSGesture) {
				this.gestureMany = new window.MSGesture();
				this.gestureMany.target = dom[0];
				this.gestureTap = new window.MSGesture();
				this.gestureTap.target = detail[0];
			}

			// dragging
			if (window.navigator.msPointerEnabled) {
				dom.on('MSPointerDown', this.onPointerDown);
				detail.on('MSPointerDown', this.onPointerDown);
				$(window).on('MSPointerMove', this.onPointerMove);
				$(window).on('MSPointerUp', this.onPointerUp);
				$(window).on('MSPointerUp MSPointerOut MSPointerCancel', this.onPointerCancel);
				dom.on('MSInertiaStart MSGestureStart MSGestureHold MSGestureEnd MSGestureChange', this.onGesture);
				detail.on('MSGestureTap', this.onTap);
			} else {
				if (Modernizr.touch) {
					dom.on('touchstart', this.onPointerDown);
					detail.on('touchstart', this.onPointerDown);
				}
				dom.on('mousedown', this.onPointerDown);
				detail.on('mousedown', this.onPointerDown);
				$(window).on('mousemove', this.onPointerMove);
				$(window).on('mouseup', this.onPointerUp);
			}
			dom.on('click', '*', this.onClick);
		},

		/************************************
			Clicking
		************************************/

		onClick : function (e) {
			if ($(e.target).closest('.is-background, .block.is-foreground').length) {
				e.preventDefault();
				e.stopPropagation();
			}
		},

		/************************************
			Zooming
		************************************/

		scale : 1,
		onGesture : function (e) {
			e = e.originalEvent || e;
			if (this.pointerCount() > 1) {
				this.scale *= e.scale;
			} else {
				if (this.scale < 1) {
					this.grid.zoomIn();
				}
				if (this.scale > 1) {
					this.grid.zoomOut();
				}
				this.scale = 1;
			}
			window.gesture = e;
		},

		pointerCount : function () {
			var i,
				count = 0;
			for (i in this.pointers) {
				count++;
			}
			return count;
		},

		/************************************
			Tapping
		************************************/

		lastTap: 0,
		onTap : function () {
			var now = +new Date();
			if (this.lastTap && now - this.lastTap < 200) {
				this.grid.hide();
			}
			this.lastTap = now;
		},

		/************************************
			Dragging
		************************************/

		isUsingSinglePointer : null,
		_lastTouch : 0,
		onPointerDown : function (e) {
			var isActionOrLink = $(e.target).closest('a[href], .spark, .delete').length > 0,
				isInBackground = $(e.target).closest('.is-background').length > 0,
				now = +new Date();

			if (e.altKey || e.ctrlKey || e.metaKey || e.button) {
				return;
			}
			// dont do anything with links
			if (isActionOrLink && !isInBackground) {
				return;
			}
			if (isInBackground) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (this.gestureMany && this.gestureTap && e.originalEvent.type === "MSPointerDown") {
				this.pointers[e.originalEvent.pointerId] = true;
				this.gestureMany.addPointer(e.originalEvent.pointerId);
				this.gestureTap.addPointer(e.originalEvent.pointerId);
				e.preventDefault();
			}
			this.grid.updatePerspective();

			if (this.pointerCount() < 2) {
				this.isUsingSinglePointer = true;
				this.gestureOne.startEvent(e);
			} else {
				if (this.isUsingSinglePointer) {
					this.gestureOne.cancelEvent(e);
				}
				this.isUsingSinglePointer = false;
			}

			if (Modernizr.touch) {
				$(e.target).on('touchmove', this.onPointerMove);
				$(e.target).on('touchend', this.onPointerUp);
			}

			// huge hack to try to prevent ios from firing mousedown after touchstart
			if (e.type === "touchstart") {
				this._lastTouch = now;
			}

			if (e.type === "mousedown" && now - this._lastTouch < 2000) {
				e.preventDefault();
				e.stopPropagation();
			}
		},

		onPointerMove : function (e) {
			if (this.isUsingSinglePointer) {
				if (this.gestureOne.moveEvent(e)) {
					e.preventDefault();
				}
			} else {
				this.gestureOne.cancelEvent(e);
			}
		},

		onPointerUp : function (e) {
			if (this.isUsingSinglePointer) {
				this.gestureOne.endEvent(e);
			}

			if (Modernizr.touch) {
				$(e.target).off('touchmove', this.onPointerMove);
				$(e.target).off('touchend', this.onPointerUp);
			}
		},

		onPointerCancel : function (e) {
			delete this.pointers[e.originalEvent.pointerId];
		},

		/************************************
			Zooming
		************************************/

		onKeyUp : function (e) {
			switch (e.keyCode) {
			case 109:
			case 189:
				this.grid.zoomIn();
				break;
			case 107:
			case 187:
				this.grid.zoomOut();
				break;
			}
		}
	});
});
