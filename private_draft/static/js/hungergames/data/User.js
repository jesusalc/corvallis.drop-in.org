define([

		'rosy/base/Model',
		'$'

	], function (Model, $) {

		var User = Model.extend({


			logOut : function () {
				this.loggedIn = false;

				// null everything
			},

			isLoggedIn : function () {
				return this.get("loggedIn");
			},

			ifLoggedIn : function (cb) {
				/*
				User.ifLoggedIn(this.proxy(function () {
					console.log("You are logged in!");
				}));
				*/
				if (this.get("loggedIn")) {
					cb();
				} else {
					window.location.hash = "/login";
				}
			},

			init : function () {
				this.defaults = {
					id : null,
					district : null, // 1-12
					backgroundImg : null,
					dateOfBirth : null,
					name : null,
					email : null,
					location : null, // city migrated from
					country : null,
					gender : null,
					occupation : null,
					pcn : null, //panem citizen number
					role: null, // citizen = 0, speaker = 1, mayor = 2
					imgURL : null,
					mobileNumber : null,
					loggedIn : false,
					totalPosts: 0,
					sparksRecieved : 0,
					sparksGiven : 0,
					csrfmiddlewaretoken : null,
					accounts : {
						facebook : {
							connected: false,
							imgURL: null
						},
						twitter : {
							connected: false,
							imgURL: null
						},
						tumblr : {
							connected: false,
							imgURL: null
						},
						youTube : {
							connected: false,
							imgURL: null
						}
					}
				};

				// for testing...
				window.user = this;

				this.sup();

				if (window.USER_JSON_DATA) {
					this.updateFromJSON(window.USER_JSON_DATA);
				}

				this.subscribe("update_user", this.updateFromJSON);
			},

			updateFromJSON : function (jsonData) {
				if (window.USER_JSON_DATA) {
					this.set("loggedIn", true);
					this.set(window.USER_JSON_DATA.user);
					//this.set("csrfmiddlewaretoken", $.cookie('csrftoken'));
				}
			}

		});

		return new User();
	});
