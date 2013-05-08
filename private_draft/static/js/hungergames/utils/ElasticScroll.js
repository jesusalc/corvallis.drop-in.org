define(

	[
		"rosy/base/Class",
		"./Easing"
	],

	function (Class, Easing) {

		"use strict";

		var VELOCITY_DAMPING = 0.9,
			SNAP_BACK_RATIO = 0.1,
			OVERFLOW_RATIO = 0.3;

		return Class.extend({

			init : function () {
				this._velocities = [0, 0, 0, 0];
				this._position = 0;
				this._velocity = 0;
			},

			/************************************
				Position
			************************************/

			_position : 0,

			position : function () {
				return this._position;
			},

			reset : function () {
				this.resetVelocity();
				this._velocity = 0;
				this._position = 0;
			},

			/************************************
				Velocity
			************************************/

			_velocities : null,
			_velocity : 0,

			setVelocity : function (vel) {
				var i;
				for (i = 0; i < 3; i++) {
					this._velocities[i] = this._velocities[i + 1];
				}
				this._velocities[3] = vel;
			},

			resetVelocity : function () {
				var velocity = 0,
					count = 0,
					i;
				for (i = 0; i < 4; i++) {
					count += i;
					velocity += this._velocities[i] * (i + 1);
					this._velocities[i] = 0;
				}
				this._velocity = velocity / count;
			},

			/************************************
				Update
			************************************/

			_isMoving : false,
			update : function () {
				if (!this._isMoving) {
					this.updateVelocity();
				}
			},

			updateVelocity : function () {
				if (this._position < this._min || this._position > this._max) {
					this.updateVelocityOutOfBounds();
				} else if (Math.abs(this._velocity) > 1) {
					this.updateVelocityInBounds();
				} else {
					this._isMoving = true;
				}
			},

			updateVelocityInBounds : function () {
				this._velocity *= VELOCITY_DAMPING;
				this._position += this._velocity;
			},

			updateVelocityOutOfBounds : function () {
				var goal = this._max;

				this._velocity *= VELOCITY_DAMPING * 0.5;

				if (Math.abs(this._velocity) < 5) {
					this._velocity = 0;

					if (Math.abs(this._position - this._max) > Math.abs(this._position - this._min)) {
						goal = this._min;
					}

					if (Math.abs(goal - this._position) < 1) {
						this._position = goal;
					} else {
						this._position = Easing.lerp(this._position, goal, SNAP_BACK_RATIO);
					}
				}

				this._position += this._velocity;
			},

			/************************************
				Min/Max
			************************************/

			_min : 0,
			_max : 0,

			setMax : function (max) {
				this._max = Math.max(max, this._min);
				this._position = Math.min(this._position || 0, this._max);
			},

			setMin : function (min) {
				this._min = Math.min(min, this._max);
				this._position = Math.max(this._position || 0, this._min);
			},

			/************************************
				Move / End
			************************************/

			move : function (val) {
				this._isMoving = true;
				if (this._position > this._max || this._position < this._min) {
					this._position += val * OVERFLOW_RATIO;
				} else {
					this._position += val;
				}

				this.setVelocity(val);
			},

			moveWithinRange : function (val) {
				this._position = Math.min(this._max, Math.max(this._min, this._position + val));
			},

			end : function () {
				this._isMoving = false;
				this.resetVelocity();
			}
		});
	}
);
