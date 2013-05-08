define(

	[
		"../Base",
		"$",
		"./Grid",
		"hungergames/modules/grid/BlockCache",
		"../../modules/YoutubePlayer"
	],

	function (Base, $, Grid, BlockCache, YoutubePlayer) {

		"use strict";

		return Base.extend({

			"static" : {
				parentClass : Grid,
			},

			block : null,

			ytplayer : null,

			load : function () {
				this.sup();

				this.update(this.params, this.data);
			},

			update : function (params, data) {
				BlockCache.getBlock(params.id, params.network, this.setBlock);
			},

			setBlock : function (block) {
				this.block = block;
				this.block.trigger('show');
			},

			transitionIn : function () {
				this.sup();
				this.setTimeout(function () {
					this.ytplayer = new YoutubePlayer($(".detail-inner")); // instantiate before the iframe loads
					this.subscribe(YoutubePlayer.FIRST_PLAY, this.onFirstPlay);
				}, 1000); // timed for transitionInComplete? doesn't work without the timer
			},

			transitionOut : function () {
				if (this.block) {
					this.block.trigger('hide');
				}

				if (this.ytplayer) {
					this.ytplayer.destroy();
					this.ytplayer = null;
				}
				this.unsubscribe(YoutubePlayer.FIRST_PLAY, this.onFirstPlay);

				this.sup();
			},

			onFirstPlay : function (n, event, vid) {
				// console.log("on first play");
				// track only the CF Trailer plays
				if (vid === "VaC3xDcZmBE") { // http://www.youtube.com/watch?feature=player_embedded&v=VaC3xDcZmBE
					var img = new Image(); // playing
					img.src = 'http://view.atdmt.com/action/SMG_MRTINX_CF_Trailer_VideoPlay';
				}
			},

			destroy : function () {
				this.sup();
			}
		});
	}
);
