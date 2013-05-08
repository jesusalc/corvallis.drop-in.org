define(

	[
		"../Base",
		"$",
		"../../modules/YoutubePlayer"
	],

	function (Base, $, YoutubePlayer) {

		"use strict";

		var body = $("html, body");

		return Base.extend({

			ytplayer : null,

			load : function () {
				this.ytplayer = new YoutubePlayer(body); // instantiate before the iframe loads
				this.subscribe(YoutubePlayer.FIRST_PLAY, this.onFirstPlay);
				this.loadComplete();
			},

			onFirstPlay : function (n, event, vid) {
				// track the CF Trailer plays
				var img = new Image(); // playing
				img.src = 'http://view.atdmt.com/action/SMG_MRTINX_CF_BTS_VideoPlay';
			},

			destroy : function () {
				this.unsubscribe(YoutubePlayer.FIRST_PLAY, this.onFirstPlay);

				this.ytplayer.destroy();
				this.ytplayer = null;

				this.sup();
			}
		});
	}
);
