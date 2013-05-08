define(

	[
		"../Base",
		"$",
		"../../modules/grid/Grid",
		"../../modules/grid/CarouselBlock",
		"../../modules/FilterSearch",
		"../../Config",
		"../../utils/Deserialize",
		"../../modules/Tutorial",
	],

	function (Base, $, Grid, CarouselBlock, FilterSearch, Config, deserialize, Tutorial) {

		"use strict";

		return Base.extend({

			grid : null,
			page : 1,
			loadedPage : 0,
			totalPages : 1,
			filterParams : null,
			route : null,
			ajaxLoadPath: null,

			load : function () {
				this.grid = new Grid($(".grid"));
				this.grid.on('scroll-to-bottom', this.onScrollToBottom);
				this.grid.on('hide', this.hideBlock);
				this.grid.on('show', this.showBlock);

				this.ajaxLoadPath = '/' + Config.get('REGION') + '/';

				this.update(this.params, this.data);

				if (window.GRID_JSON_DATA) {
					if (window.GRID_JSON_DATA.featured_carousels) {
						this.createFeatures(window.GRID_JSON_DATA.featured_carousels);
					}
					this.page = window.GRID_JSON_DATA.page;
					this.ajaxLoadPath = window.GRID_JSON_DATA.load_path;
					this.dataLoaded(window.GRID_JSON_DATA);
					window.GRID_JSON_DATA = null;
				} else {
					this.dataLoad();
				}

				FilterSearch.on('search', this.filterAndSearch);
				FilterSearch.show();

				// var tutorial = new Tutorial();

				this.sup();
			},

			updateRoute : function () {
				var params = $.param(this.filterParams || {});
				this.route = '/' + Config.get('REGION') + '/';
				if (params) {
					this.route += '?' + params;
				}
			},

			filterAndSearch : function (e, n, params) {
				this.filterParams = params;
				this.updateRoute();
				if (this.router) {
					this.router.route(this.route, params);
				}
				this.grid.reset();
				this.page = 1;
				this.loadedPage = 0;
				this.totalPages = 1;
				this.dataLoad();
			},

			update : function (params, data) {
				this.filterParams = data || {};
				$.extend(this.filterParams, deserialize(decodeURIComponent(location.search)));
				this.updateRoute();
			},

			/************************************
				Showing / Hiding
			************************************/

			hideBlock : function (e) {
				if (this.router) {
					this.router.route(this.route);
				}
			},

			showBlock : function (e, n, block) {
				if (this.router && block) {
					this.router.route(block.route(), {
						block: block
					});
				}
			},

			/************************************
				Loading
			************************************/

			dataLoad : function () {
				var params = $.extend({}, this.filterParams);
				params.page = this.page;
				params.format = 'json';
				$.ajax(this.ajaxLoadPath, {
					dataType : 'json',
					data : params
				}).done(this.dataLoaded).fail(this.dataError);
			},

			dataLoaded : function (data) {
				this.grid.canEdit = data.can_edit;
				this.loadedPage = +data.page;
				this.totalPages = +data.total_pages;
				if (data.object_list) {
					this.grid.addPosts(data.object_list);
				}
			},

			dataError : function (e) {

			},

			sortFixtures : function (a, b) {
				return a.order - b.order;
			},

			createFeatures : function (data) {
				var i, features = [];

				// never show features on a search
				if (this.filterParams.hot_new ||
					this.filterParams.post_type ||
					this.filterParams.source_filter) {
					return;
				}

				for (i in data) {
					data[i].primary_key = data[i].size = i;
					features.push(data[i]);
				}
				features.sort(this.sortFixtures);
				for (i = 0; i < features.length; i++) {
					if (features[i] && features[i].features && features[i].features.length) {
						this.grid.add(new CarouselBlock(features[i]));
					}
				}
			},

			/************************************
				Scrolling
			************************************/

			onScrollToBottom : function () {
				if (this.page >= this.totalPages) {
					return;
				}
				// only load if the previous page has loaded
				if (this.page === this.loadedPage) {
					this.page++;
					this.dataLoad();
				}
			},

			transitionIn : function () {
				this.sup();
			},

			transitionOut : function () {
				this.sup();
			},

			destroy : function () {
				this.sup();
			}
		});
	}
);
