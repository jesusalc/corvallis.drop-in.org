define([],

	function () {

		"use strict";

		return {
			percent : function (a, b, c) {
				return (c - a) / (b - a);
			},

			clamp : function (min, max, val) {
				return Math.max(min, Math.min(max, val));
			},

			lerp : function (a, b, c) {
				return a + ((b - a) * c);
			},

			lerpEaseOut : function (a, b, c) {
				var c2 = c * c,
					c3 = c2 * c,
					diff = b - a;
				return a + diff * (c2 * c3 - 5 * c2 * c2 + 10 * c3 - 10 * c2 + 5 * c);
			},

			lerpEaseIn : function (a, b, c) {
				return a + (b - a) * (c * c * c * c * c);
			},

			lerpEaseInOut : function (a, b, c) {
				var ts = c * c;
				var tc = ts * c;
				var diff = b - a;
				return a + diff * ((6 * tc * ts) - (15 * ts * ts) + (10 * tc));
			}
		};
	}
);
