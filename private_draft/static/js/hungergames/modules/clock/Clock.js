define(

	[
		"rosy/base/Class",
		"moment",
		"$",
	],

	function (Class, moment, $) {

		"use strict";

		return Class.extend({

			timer : null,
			$el : null,

			$dayHour : null,
			$minSec : null,
			expired : false,

			init : function (el) {

				this.$el = $(el);

				this.$dayHour = this.$el.find(".day-hour");
				this.$minSec = this.$el.find(".minute-second");
				this.$time = this.$el.find(".time");
				this.tickClock();
				this.sup();
			},

			formatClockArray : function (a, b) {

				a = Math.max(a, 0);
				b = Math.max(b, 0);

				if (a < 10) {
					a = '0' + a;
				}
				if (b < 10) {
					b = '0' + b;
				}
				return '<b>' + a + '</b><span>:</span><b>' + b + '</b>';
			},

			tickClock : function () {

				var target = moment("2013-04-14T18:00-07:00"),
					dur = moment.duration(target.diff());

				if (dur._milliseconds <= 0) {
					this.expired = true;
				}

				if (this.expired) {
					this.$el.addClass("expired");
				}

				this.$time.addClass('active');
				this.$dayHour.html(this.formatClockArray(dur.hours(), dur.days()));
				this.$minSec.html(this.formatClockArray(dur.minutes(), dur.seconds()));

				this.timer = this.setTimeout(this.tickClock, 1000);
			}
		});
	}
);
