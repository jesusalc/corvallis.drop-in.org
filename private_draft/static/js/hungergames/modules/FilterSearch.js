define(
	[
		"rosy/modules/Module",
		"$",
		"../utils/Deserialize"
	],

	function (Module, $, deserialize) {

		"use strict";

		var FilterSearch = Module.extend({

			$search : $('header .search'),
			$input : $('header .search input'),

			$filter : $('header .filter'),
			$filters : $('header .filters'),

			post_type : null,
			hot_new : null,
			source_filter : null,

			init : function () {
				this.$search.on('submit', this.submit);
				this.$search.on('click', '[data-clear]', this.clearInput);
				this.$filters.on('click', '[data-post-type]', this.checkPostType);
				this.$filters.on('click', '[data-hot-new]', this.checkHotNew);
				this.$filters.on('click', '[data-source-filters]', this.checkSources);
			},

			clearInput : function () {
				this.search = null;
				this.$input.val('');
				this.refilter();
			},

			searchFromQuery : function (query) {
				var params = deserialize(query);
				this.search = params.text;
				this.refilter();
			},

			submit : function (e) {
				this.refilter();
				this.$input.blur();
				return false;
			},

			checkPostType : function (e) {
				var active,
					post_type = this.post_type = [],
					i;
				active = this.$filters.find('[data-post-type].active');
				if (active.length === 3) {
					active.removeClass('active');
				}
				$(e.currentTarget).toggleClass('active');
				active = this.$filters.find('[data-post-type].active');
				if (active.length === 0) {
					this.$filters.find('[data-post-type]').addClass('active');
				} else {
					active.each(function () {
						post_type.push($(this).data('post-type'));
					});
				}

				this.publish("track.event", {
					category : "Filters",
					action : "Post Type",
					label : post_type.join(", "),
					value : 1
				});

				this.refilter();
				return false;
			},

			checkSources : function (e) {
				var dom = $(e.currentTarget);
				this.source_filter = dom.data('source-filters');
				this.$filters.find('[data-source-filters]').removeClass('active');
				dom.addClass('active');

				this.publish("track.event", {
					category : "Filters",
					action : "Source",
					label : this.source_filter,
					value : 1
				});

				this.refilter();
				return false;
			},

			checkHotNew : function (e) {
				var dom = $(e.currentTarget);
				this.hot_new = dom.data('hot-new');
				this.$filters.find('[data-hot-new]').removeClass('active');
				dom.addClass('active');

				this.publish("track.event", {
					category : "Filters",
					action : "Hot or New",
					label : this.hot_new,
					value : 1
				});

				this.refilter();
				return false;
			},

			refilter : function () {
				var params = {},
					val = this.$input.val() || this.search;
				if (val) {
					params.text = val;

					this.publish("track.event", {
						category : "Search",
						action : "Search",
						label : val,
						value : 1
					});
				}
				if (this.post_type && this.post_type.length &&  this.post_type.length < 3) {
					params.post_type = this.post_type.join(',');
				}
				if (this.source_filter) {
					params.source_filter = this.source_filter;
				}
				if (this.hot_new) {
					params.hot_new = this.hot_new;
				}
				this.$filter.removeClass('active');
				this.trigger('search', params);
			},

			show : function () {
				this.$search.addClass('visible');
				this.$filter.addClass('visible');
			},

			hide : function () {
				this.$search.removeClass('visible');
				this.$filter.removeClass('visible');
			}

		});

		return new FilterSearch();
	}
);
