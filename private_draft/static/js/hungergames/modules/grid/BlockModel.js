/*jshint bitwise:false*/
define(function (require, exports, module) {

	"use strict";

	var blockTemplatePhoto           = require("./block/photo"),
		blockTemplateText            = require("./block/text"),
		blockTemplateAuthor          = require("./block/author"),
		detailTemplatePhoto          = require("./detail/photo"),
		detailTemplateVideo          = require("./detail/video"),
		detailTemplateText           = require("./detail/text"),
		detailTemplateAuthor         = require("./detail/author"),
		blockTemplateFeaturedPhoto   = require("./block/featured-photo"),

		moment = require("moment"),
		linkify = require("linkify"),
		Config = require("hungergames/Config"),
		shortenNumber = require("../../utils/ShortenNumber"),

	postUrls = {
		twitter : "http://twitter.com/[poster_sn]/status/[post_id]",
		tumblr : "http://[poster_sn].tumblr.com/post/[post_id]",
		facebook : "http://facebook.com/[post_id]",
		youtube : "http://youtu.be/[post_id]",
		rss : "[post_id]"
	},

	posterUrls = {
		twitter : "http://twitter.com/[poster_sn]",
		tumblr : "http://[poster_sn].tumblr.com/",
		facebook : "http://facebook.com/[poster_id]",
		youtube : "http://youtube.com/user/[poster_sn]",
		rss : "[post_id]"
	},

	rIsYoutube = /(youtu.be)|(youtube.com)/,
	rYoutubeId = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|v=)([^#\&\? ]*).*/;

	require("libs/moment.twitter");

	return require("rosy/base/Model").extend({

		defaults : {
			absolute_url : '/',
			absolute_url_encoded : '/',
			image_url : '',
			image_url_encoded : '',
			post_url : '',
			poster_url : '',
			embed_url : '',
			aspect_ratio : '',
			share_text : ''
		},

		init : function (data) {
			this.sup(this.normalizeData(data));
		},

		normalizeData : function (data) {
			if (!data.kind) {
				return data;
			}
			var op = data.post || data.photo || data.video || data.article || data.hashtag || data;
			if (data.kind && data.kind !== "post") {
				op.post_type = "feat_" + data.kind;
			}
			op.poster_sn = op.poster_sn || data.featured_title || data.source;
			op.poster_url = op.poster_url || data.source_link;
			op.post_url = op.post_url || data.source_link;
			op.avatar_url = op.avatar_url || data.source_icon;
			op.image_url = op.image_url || op.image || op.cover;
			op.primary_key = op.primary_key || data.id;
			op.total_sparks = op.total_sparks || data.total_sparks;
			op.network = op.network || "feature";
			return op;
		},

		/************************************
			Custom Setters
		************************************/

		set_post_date : function (input) {
			var post_date = moment.utc(input);
			this.set('display_date', post_date.format("ll"));
			// this.set('timeago', post_date.twitter());
			// just using Day Month for now as there is a bug in the
			// twitter timestamp parser
			this.set('timeago', post_date.format('D MMM'));
			return input;
		},

		set_post_type : function (input) {
			var lower = ("" + input).toLowerCase() || 'text';
			this.set('css_class', 'is-' + lower);
			return lower;
		},

		set_network : function (input) {
			var lower = ("" + input).toLowerCase();
			this.set('source_icon', 'icon-' + lower);
			this.set('is_' + lower, true);
			this.set('css_class', 'is-' + lower);
			return lower;
		},

		set_css_class : function (str) {
			var old = this.get('css_class') || "";
			return old + ' ' + str;
		},

		set_original_images : function (object) {
			object = object || [];
			var i;
			for (i = 0; i < object.length; i++) {
				if (object[i]) {
					object[i].aspect_ratio = object[i].width > object[i].height ? 'landscape' : 'portrait';
				}
			}
			return object;
		},

		set_video_url : function (input) {
			var isYoutube = input.match(rIsYoutube),
				isVimeo,
				match;
			if (isYoutube) {
				match = input.match(rYoutubeId);
				if (match && match[2].length === 11) {
					this.set('embed_url', "http://www.youtube.com/embed/" + match[2] + "?rel=0&color=white&iv_load_policy=3&modestbranding=1&showinfo=0&wmode=opaque");
				}
			}
			return input;
		},

		set_total_sparks : function (num) {
			this.set('total_sparks_display', shortenNumber(num));
			return num;
		},

		/************************************
			Custom Getters
		************************************/

		get_poster_sn : function () {
			var poster_sn = this.__data.poster_sn,
				post_id = this.__data.post_id;
			if (!poster_sn && post_id) {
				return post_id.split('/')[2];
			}
			return poster_sn;
		},

		get_poster_url : function () {
			var network = this.get('network'),
				poster_id = this.get('poster_id'),
				poster_sn = this.get('poster_sn'),
				post_id = this.get('post_id');
			if (posterUrls[network]) {
				return posterUrls[network]
					.replace('[post_id]', post_id)
					.replace('[poster_sn]', poster_sn)
					.replace('[poster_id]', poster_id);
			}
			return this.__data.poster_url || "";
		},

		get_post_url : function () {
			var network = this.get('network'),
				poster_id = this.get('poster_id'),
				poster_sn = this.get('poster_sn'),
				post_id = this.get('post_id');
			if (postUrls[network]) {
				return postUrls[network]
					.replace('[post_id]', post_id)
					.replace('[poster_sn]', poster_sn)
					.replace('[poster_id]', poster_id);
			}
			return this.__data.post_url || "";
		},

		get_background_image : function () {
			var url = this.get('image_url'),
				original_images = this.get('original_images');

			if (url) {
				return url;
			}
			if (original_images && original_images[0] && original_images[0].url) {
				return original_images[0].url;
			}
			return '';
		},

		get_aspect_ratio : function () {
			return this.get('image_width') > this.get('image_height') ? 'landscape' : 'portrait';
		},

		get_absolute_url : function () {
			return location.protocol + '//' + location.host + this.get_relative_url();
		},

		get_image_url_encoded : function () {
			return encodeURIComponent(this.get("image_url"));
		},

		get_absolute_url_encoded : function () {
			return encodeURIComponent(this.get_absolute_url());
		},

		get_relative_url : function () {
			return ['', Config.get('REGION'), this.get('network'), this.get('primary_key'), ''].join('/').toLowerCase();
		},

		get_body : function (input) {
			var out = this.__data.body || '';
			if (!this.__data.is_twitter) {
				return linkify('<p>' + out.replace(/\n+/g, '</p><p>') + '</p>');
			}
			return '<p>' + out + '</p>';
		},

		get_share_text : function () {
			var copy = this.__data.title || this.__data.body || '';
			return encodeURIComponent(copy.replace(/\n/g, ''));
		},

		width_height : function () {
			var data = this.get(),
				ratio;
			switch (data.post_type) {
			case "video":
				return (Math.random() < 0.2) ? [2, 2] : [1, 1];
			case "photo": // intentional fall through
				ratio = data.image_width / data.image_height;
				if (!data.image_width || !data.image_height) {
					return (Math.random() < 0.2) ? [2, 2] : [1, 1];
				}
				if (ratio > 1.5) {
					return [2, 1];
				} else if (ratio > 0.8) {
					return (Math.random() < 0.2) ? [2, 2] : [1, 1];
				}
				return [1, 2];
			case "text":
				data.body = data.body || "";
				if (data.network === "twitter") {
					return [1, 1];
				} else if (data.body.length > 200) {
					return [1, 2];
				}
				return [1, 1];
			}
			return [1, 1];
		},

		get_width_height : function () {
			return this.width_height();
		},

		/************************************
			Render
		************************************/

		renderBlock : function () {
			var data = this.get();
			switch (data.post_type) {
			case "feat_photo":
			case "feat_video":
			case "feat_article":
				return blockTemplateAuthor(data) + blockTemplateFeaturedPhoto(data);
			case "video":
			case "photo": // intentional fall through
				return blockTemplateAuthor(data) + blockTemplatePhoto(data);
			case "text":
				return blockTemplateAuthor(data) + blockTemplateText(data);
			}
		},

		renderDetail : function () {
			var output = "",
				data = this.get();

			output += detailTemplateAuthor(data);

			switch (data.post_type) {
			case "feat_photo":
			case "photo":
				output += detailTemplatePhoto(data);
				break;
			case "feat_article":
			case "text":
				output += detailTemplateText(data);
				break;
			case "feat_video":
			case "video":
				output += detailTemplateVideo(data);
				break;
			}
			return output;
		}
	});
});
