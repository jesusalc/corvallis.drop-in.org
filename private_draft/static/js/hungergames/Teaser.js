define(

	[
		"rosy/base/Class",
		"hungergames/modules/Intro",
		"hungergames/modules/visualizer/Visualizer",
		"hungergames/modules/clock/Clock",
		"moment",
		"$",
		"$plugin!transit"
	],

	function (Class, Intro, Visualizer, Clock, moment, $) {

		"use strict";

		return Class.extend({

			visualizer : null,
			clock : null,

			$tweet : null,

			init : function () {

				this.clock = new Clock(".teaser-clock");

				this.visualizer = new Visualizer($('.visualizer'));

				this.$tweet = $(".tweet");

				var target = moment("2013-04-14T10:00-07:00"),
					dur = moment.duration(target.diff());

				if (dur._milliseconds <= 0) {
					this.$tweet.css("display", "none");
					this.$tweet.addClass("hide");
				}

				else {
					this.setTimeout(function () {
						this.$tweet.addClass("hide");
					}, 10000);
				}

				this.setTimeout(function () {
					$(".visualizer").addClass("active");
				}, 500);

				this.sup();
			},

			introComplete : function () {

			}
		});
	}
);
