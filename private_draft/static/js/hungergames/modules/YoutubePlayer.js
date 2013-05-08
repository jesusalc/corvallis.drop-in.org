/**
 *  Track events on Youtube iframe-embedded videos
 *  Also, automatically adds "wmode=transparent" to videos
 *
 *	@param $container - the containing element is searched for iframes
 *  ex: new YoutubePlayer($(".video-container"));
 */

define(
	[
		"rosy/modules/Module",
		"$"
	],

	function (Module, $) {

		"use strict";

		/*global YT */
		window.YT = window.YT || {};

		var EVENTS = {
				FIRST_PLAY : "module/YoutubePlayer/onFirstPlay",

				READY : "module/YoutubePlayer/onReady",
				STATE_CHANGE : "module/YoutubePlayer/onStateChange",
				API_READY : "module/YoutubePlayer/onAPIReady"
			},

			rIsYoutube = /(youtu.be)|(youtube.com)/,
			rYoutubeId = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|v=)([^#\&\? ]*).*/;

		return Module.extend({

			$ : null,

			isLoaded : false,
			players : null,
			iframes : null,

			"static" : EVENTS,

			init : function ($container) {
				this.players = {};
				this.iframes = {};

				if ($container) {
					this.gatherVideos($container);
				}

				this.loadJSDK();
			},

			update : function ($container) {
				this.gatherVideos($container);

				if (this.isLoaded) { //
					this.addListeners();
				}
			},

			gatherVideos: function ($container) {
				$container = $container || $(document);

				var matches,
					iframes = $container.find('iframe'),
					i = iframes.length - 1,
					$targ,
					id,
					src;

				for (i; i >= 0; i--) {
					$targ = $(iframes[i]);
					src = $targ.attr("src");
					matches = src.match(rYoutubeId);

					id = matches[2];

					if (id && src.match(rIsYoutube)) {
						$targ.attr('id', "");
						$targ.attr('data-id', id); // update id of iframe

						$targ.wrap('<div id="' + id + '">');
						this.iframes[id] = $targ;
					}
				}
			},

			onReady : function (event) {
				this.publish(EVENTS.READY, event);
			},

			onStateChange : function (event) {
				var id = event.target.a.id;
				switch (event.data) {
				case YT.PlayerState.PLAYING:
					if (!this.players[id].hasPlayed) {
						this.players[id].hasPlayed = true;
						this.publish(EVENTS.FIRST_PLAY, event, id);
					}
					break;

				default:
					// console.log("unhandled event: ", event);
					break;
				}

				this.publish(EVENTS.STATE_CHANGE, event, id);
			},

			onYouTubeIframeAPIReady : function (event) {
				this.isLoaded = true;

				this.addListeners();

				this.publish(EVENTS.API_READY, event);
			},

			addListeners : function () {
				var i,
					targ,
					id,
					data;

				for (i in this.iframes) {
					targ = $(this.iframes[i]);
					id = targ.data("id");

					if (this.players[id]) {
						this.players[id] = null;
						// dont know how to manually remove events
					}

					this.players[id] = new YT.Player(id, {
						videoId : id,
						playerVars: {
							// 'autoplay' : 1,
							'wmode': 'transparent'
						},
						events: {
							'onReady': $.proxy(this.onReady, this),
							'onStateChange': $.proxy(this.onStateChange, this)
						}
					});
				}
			},

			loadJSDK : function () {
				if (!this.isLoaded) {
					if (YT.PlayerState) {
						this.addListeners();
					} else {
						window.onYouTubeIframeAPIReady = $.proxy(this.onYouTubeIframeAPIReady, this);

						var tag = document.createElement('script'),
							firstScriptTag = document.getElementsByTagName('script')[0];

						tag.src = "//www.youtube.com/iframe_api";
						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
					}
				}
			},

			destroy : function () {
				var i = this.players.length - 1;

				for (i; i >= 0; i--) {
					this.players[i].stopVideo();
					this.players[i].destroy();
					this.players[i] = null;
				}

				this.players = null;
				this.iframes = null;

				this.sup();
			}

		});
	}
);
