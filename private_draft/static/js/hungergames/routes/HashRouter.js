define(function (require, exports, module) {

	"use strict";

	return require("rosy/views/HashRouter").extend({

		init : function () {
			this.sup();

			// Login / Profile / Registration routes
			this.addRoute("/login", require("../views/userprofile/Login"));
			this.addRoute("/register", require("../views/userprofile/Register"));
			this.addRoute("/edit", require("../views/userprofile/Edit"));
			this.addRoute("/merge", require("../views/userprofile/Merge"));
			this.addRoute("/pass-generator", require("../views/userprofile/DipDownloader"));
			this.addRoute("/delete-post", require("../views/grid/Delete"));
			this.addRoute("/help", require("../modules/Tutorial"));
		}

	});
});
