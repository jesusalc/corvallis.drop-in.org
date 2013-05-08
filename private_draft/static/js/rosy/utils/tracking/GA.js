define(

	[
		"rosy/base/Class",
		"$"
	],

	function (Class, $) {

		"use strict";

		var SDK_PATH = ("https:" === location.protocol ? "//ssl" : "//www") + ".google-analytics.com/ga.js",
			DEBUG_MODE = false,
			$doc = $(document),
			_gaq = window._gaq = window._gaq || [];

		var GA = Class.extend({

			init : function () {

				this.subscribe("track.pageView", this.handlePageView);
				this.subscribe("track.event", this.handleEvent);
				this.subscribe("track.social", this.handleSocial);
				this.subscribe("track.setCustomVar", this.handleCustomVar);

				this.subscribe("track.GA.pageView", this.handlePageView);
				this.subscribe("track.GA.event", this.handleEvent);
				this.subscribe("track.GA.setCustomVar", this.handleCustomVar);

				$doc.on("click touchstart", "[data-event-action]", this.onTrackElementClick);
			},

			initialize : function (accountID, options) {

				options = options || {};

				_gaq.push(["_setAccount", accountID]);
				_gaq.push(["_setDomainName", options.domain || window.location.host]);

				if (options.link) {
					_gaq.push(["_setAllowLinker", true]);
				}

				if (options.initialPageView !== false) {
					this.trackPageView();
				}

				this.loadSDK(SDK_PATH);
			},

			debug : function () {
				DEBUG_MODE = !DEBUG_MODE;
			},

			loadSDK : function (path, cb) {
				require([path], function (SDK) {
					_gaq = window._gaq = window._gaq || [];
					if (cb) {
						cb();
					}
				});
			},

			trackPageView : function (url) {

				var a = ["_trackPageview"];

				a[1] = url || window.location.pathname;

				return this.push(a);
			},

			trackEvent : function (data) {
				var a = ["_trackEvent"];

				if (data.category) {
					a.push(data.category);
				}

				if (data.action) {
					a.push(data.action);
				}

				if (data.label) {
					a.push(data.label);
				}

				if (data.value) {
					a.push(data.value);
				}

				if (data.nonInteraction) {
					a.push(true);
				}

				return this.push(a);
			},

			trackSocial : function (data) {
				var a = ["_trackSocial"];
				a.push(data.network);
				a.push(data.action);

				if (data.target) {
					a.push(data.target);
				}

				return this.push(a);
			},

			log : function () {

				var args = Array.prototype.slice.call(arguments, 0);

				if (DEBUG_MODE) {
					if (args.length > 1 && window.console && window.console.log) {
						window.console.log(args);
					}
					else if (window.console && window.console.log) {
						window.console.log(args[0]);
					}
				}
			},


			onTrackElementClick : function (e) {
				var $el = $(e.currentTarget),
					data = $el.data();

				if (data.trackSocial) {
					this.trackSocial({
						network : data.trackSocial,
						action : data.eventAction,
						target : data.eventTarget || null
					});
					return;
				}

				this.trackEvent({
					category : data.eventCategory,
					action : data.eventAction,
					label : data.eventLabel,
					value : data.eventValue || 1
				});
			},

			handlePageView : function (n) {
				this.trackPageView(n.data.url);
			},

			handleEvent : function (n) {
				this.trackEvent(n.data);
			},

			handleSocial : function (n) {
				this.trackSocial(n.data);
			},

			handleCustomVar : function (n) {

				var index = n.data.index,
					name = n.data.name,
					value = n.data.value,
					scope = n.data.scope || 1;

				return this.push(["_setCustomVar", index, name, value, scope]);
			},

			push : function (a) {
				this.log(a);
				return _gaq.push(a);
			}

		});

		return new GA();
	}
);
