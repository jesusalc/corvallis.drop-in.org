define(function (require, exports, module) {

	"use strict";

	var Config = require("../Config");

	return require("./HistoryStackRouter").extend({

		init : function () {
			this.sup([], {
				usePushState : true
			});

			this.setRoutes();
			this.update();
		},

		setRoutes : function () {

			if (!Config.get("IS_TEASER")) {

				// Behind the Scenes
				this.addRoute("/behind-the-scenes",                           require("../views/behind-the-scenes/BehindTheScenes"));

				// EPK routes
				this.addRoute("/:region/epk/",                                require("../views/epk/Home"));
				this.addRoute("/:region/epk/:movie",                          require("../views/epk/Home"));
				this.addRoute("/thewebsiteadmin/epk/epk/:key/edit/preview",   require("../views/epk/Home"));

				this.addRoute("/:region/epk/:movie/video/:slug",              require("../views/epk/Videos"));
				this.addRoute("/:region/epk/:movie/poster/:slug",             require("../views/epk/Posters"));
				this.addRoute("/:region/epk/:movie/photo/:slug",              require("../views/epk/Photos"));
				this.addRoute("/:region/epk/:movie/feature/:slug",            require("../views/epk/Features"));
				this.addRoute("/:region/epk/:movie/cast-and-crew/:slug",      require("../views/epk/CastCrew"));

				// Login / Profile / Registration routes
				this.addRoute("/profile",                                     require("../views/userprofile/Profile"));
				this.addRoute("/register",                                    require("../views/userprofile/Register"));

				// Grid routes
				this.addRoute("/:region",                                     require("../views/grid/Grid"));
				this.addRoute("/:region/:network/:id",                        require("../views/grid/Post"));
			}
		},

		onRoute : function (path, data) {
			this.publish("track.pageView", {url : path});
			this.sup(path, data);
		}
	});
});
