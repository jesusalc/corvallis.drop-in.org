define(

	[
		"handlebars",
		"moment"
	],

	function (hbs, moment) {

		var p,
			langData = moment.langData('en');

		langData.relativeTime.m = langData.relativeTime.mm = "%dm";
		langData.relativeTime.h = langData.relativeTime.hh = "%dh";

		function link(str, href) {
			str = hbs.Utils.escapeExpression(str);
			href = hbs.Utils.escapeExpression(href);
			return '<a href="' + href + '" target="_blank">' + str + '</a>';
		}

		function helperFunc(p) {
			return function (context, options) {
				//context = hbs.Utils.escapeExpression(context);
				return new hbs.SafeString(helpers[p](context, options));
			};
		}

		var helpers = {

			parseTweet : function (context, options) {
				var txt = helpers.parseURLs(context);
				txt = helpers.parseUsernames(txt);
				txt = helpers.parseHashtags(txt);
				return txt;
			},

			parseHashtags : function (context, options) {
				return context.replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
					var tag = t.replace("#", "%23");
					return link(t, "http://www.twitter.com/search?q=" + tag);
				});
			},

			parseURLs : function (context, options) {

				var i,
					txt = context.text,
					url;

				// console.log(txt);

				context.entities = context.entities || {};
				context.entities.urls = context.entities.urls || [];

				for (i = 0; i < context.entities.urls.length; i ++) {
					url = context.entities.urls[i];
					txt = txt.replace(url.url, link(url.display_url, url.url));
				}

				return txt;
			},

			parseUsernames : function (context, options) {
				return context.replace(/[@]+[A-Za-z0-9-_]+/g, function (u) {
					var username = u.replace("@", "");
					return link(u, "http://twitter.com/" + username);
				});
			},

			linkTwitterUser : function (context, options) {
				return link("@" + context, "http://twitter.com/" + context);
			},

			parseTwitterDate : function (context, options) {

				var dateStr,
					d = moment.utc(context.created_at, "ddd MMM D HH:mm:ss Z YYYY"),
					now = moment(),
					hoursSince = now.diff(d, "hours");

				if (hoursSince <= 24) {
					dateStr = d.fromNow(true);
				}

				else {
					dateStr = d.format("D MMM");
				}

				return link(dateStr, "http://twitter.com/" + context.user.screen_name + "/statuses/" + context.id_str);
			},

			link : function (context, options) {
				return link(context, options.hash.href);
			}
		};

		for (p in helpers) {
			hbs.registerHelper(p, helperFunc(p));
		}

		return hbs;

	}
);
