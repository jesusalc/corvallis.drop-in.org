define(

	[
		"rosy/polyfills/request-animation-frame"
	],

	function (raf) {

		"use strict";

		return function (cb) {
			var needsUpdate = false,
				that = this;

			function callIfNeeded(delta) {
				if (!needsUpdate) {
					return;
				}
				needsUpdate = false;
				cb.call(that, delta);
			}

			return function () {
				that = this;
				needsUpdate = true;
				raf(callIfNeeded);
			};
		};
	}
);
