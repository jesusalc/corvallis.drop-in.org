define(

	[
		"rosy/base/Class",
		"$",
		"../../utils/Easing"
	],

	function (Class, $, Easing) {

		"use strict";

		return Class.extend({

			block : null,
			detail : null,

			init : function (grid) {
				this.grid = grid;
			},

			/************************************
				XY Getters
			************************************/

			getX : function (e) {
				var oe = e.originalEvent;
				oe = oe && oe.touches && oe.touches[0] || oe;
				return oe.pageX;
			},

			getY : function (e) {
				var oe = e.originalEvent;
				oe = oe && oe.touches && oe.touches[0] || oe;
				return oe.pageY;
			},

			/************************************
				Start
			************************************/

			startX : 0,
			startY : 0,
			isStarted : false,

			// move direction is one of 3 values
			// 0 : movement undecided
			// 1 : movement horizontal
			// 2 : movement vertical
			moveDirection : 0,

			startEvent : function (e) {
				this.block = $(e.target).closest('.block').data('block') || null;
				this.draggable = $(e.target).closest('.block, .detail').data('block') || null;
				this.detail = $(e.target).closest('.detail').data('block') || null;

				this.currentX = this.startX = this.getX(e);
				this.currentY = this.startY = this.getY(e);

				this.moveDirection = 0;

				this.isStarted = true;
			},

			_startHorizontal : function () {
				if (this.draggable) {
					this.draggable.startGesture(this.currentX, this.currentY);
				}
			},

			/************************************
				Move
			************************************/

			currentX : 0,
			currentY : 0,

			moveEvent : function (e) {
				if (!this.isStarted) {
					return;
				}

				var currentX = this.getX(e),
					currentY = this.getY(e);

				this.diffX = currentX - this.currentX;
				this.diffY = currentY - this.currentY;

				this.currentX = currentX;
				this.currentY = currentY;

				if (!this.moveDirection) {
					this._calculateMoveDirection();
				}
				if (this.moveDirection === 1) {
					this._moveHorizontal();
					return true;
				}
			},

			_moveHorizontal : function () {
				if (this.draggable) {
					this.draggable.moveGestureToXY(this.currentX, this.currentY);
					this.draggable.moveGestureXY(this.diffX, this.diffY);
				}
			},

			_calculateMoveDirection : function () {
				var xdiff = Math.abs(this.currentX - this.startX),
					ydiff = Math.abs(this.currentY - this.startY);

				// don't choose a movement until we move far enough away
				if (xdiff + ydiff < 6) {
					return;
				}

				this.moveDirection = xdiff > ydiff ? 1 : 2;

				if (this.moveDirection === 1) {
					this._startHorizontal();
				}
			},

			/************************************
				End
			************************************/

			_endHorizontal : function () {
				if (this.draggable) {
					this.draggable.endGesture();
				}
			},

			_endUndecided : function () {
				if (this.block) {
					this.block.show();
				} else if (!this.detail) {
					this.grid.hide();
				}
			},

			endEvent : function (e) {
				if (this.moveDirection === 1) {
					this._endHorizontal();
				} else if (this.moveDirection === 0 && this.isStarted) {
					this._endUndecided();
				}
				this.isStarted = false;
				this.block = null;
				this.detail = null;
				this.draggable = null;
			},

			/************************************
				End
			************************************/

			cancelEvent : function (e) {
				if (this.block) {
					this.block.cancelGesture();
				}
				this.isStarted = false;
				this.block = null;
				this.detail = null;
				this.draggable = null;
			}
		});
	}
);
