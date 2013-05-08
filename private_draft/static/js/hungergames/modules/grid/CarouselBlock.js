/*jshint bitwise:false*/
define(

	[
		"./Block",
		"$",
		"./BlockCache",
		"../../utils/Easing",
		"./block/carousel",
		"../FilterSearch"
	],

	function (Block, $, BlockCache, Easing, blockTemplate, FilterSearch) {

		"use strict";

		var TIME_BETWEEN_FRAMES = 5000,
			TIME_BETWEEN_FRAMES_OFFSET = 0;

		return Block.extend({

			models : null,

			init : function (data) {
				var size = (data.size || '3x3').split('x');
				this.timeToNext = TIME_BETWEEN_FRAMES + TIME_BETWEEN_FRAMES_OFFSET;
				TIME_BETWEEN_FRAMES_OFFSET += TIME_BETWEEN_FRAMES / 3;
				this.sup();
				this.initModels(data.features);
				this.render();
				this.setWidthHeight(~~size[0] || 1, ~~size[1] || 1);
				this.dom.on('mousedown touchstart MSPointerDown', '.icons span', this._onMouseDown);
			},

			initModels : function (data) {
				var i,
					model;
				this.models = [];
				this.count = data.length;
				for (i = 0; i < data.length; i++) {
					model = BlockCache.addOne(data[i]);
					this.models.push(model);
					model.on('changeany', this.renderItems);
				}
				this.currentModel = this.models[0];
			},

			/************************************
				Render
			************************************/

			$items : $(),
			$itemWrap : $(),
			$icons : $(),
			$timers : $(),

			render : function () {
				this.dom.removeClass().addClass('block is-carousel');
				this.detail.removeClass().addClass('detail');
				if (this.count === 1) {
					this.dom.addClass('is-single-item');
				}
				this.dom.html(blockTemplate({}));
				this.$author = $('<div>').appendTo(this.dom);
				this.renderIcons();
				this.buildItems();
				this.renderItems();
				this.renderOffset();
				this.renderTime();
			},

			buildItems : function () {
				var i,
					html = '',
					items = this.dom.find('.items');

				for (i = 0; i < this.count; i++) {
					html += '<div class="item"></div>';
				}
				items.html(html);
				this.$items = items.find('.item');
				this.$itemWrap = items;
			},

			renderItems : function () {
				this.$items.each(this.proxy(function (i, dom) {
					var model = this.models[i],
						backgroundImage = model.get('background_image'),
						cssClass = model.get('css_class') || '',
						$dom = $(dom);
					if (backgroundImage) {
						$dom.css('background-image', 'url(' + backgroundImage + ')');
					}
					$dom.addClass('carousel-block ' + cssClass).html(this.models[i].renderBlock());
				}));
				this.renderCurrentDetail();
			},

			renderIcons : function () {
				if (this.count < 2) {
					return;
				}

				var dom = this.dom.find('.icons'),
					i,
					html = '';
				for (i = 0; i < this.count; i++) {
					html += '<span><i></i><b></b></span>';
				}
				dom.html(html);
				this.$icons = dom.find('span');
				this.$timers = dom.find('i');
			},

			_lastX : -1,
			renderOffset : function () {
				var x = this.offset * 25;
				if (this._lastX === x || this._globalColumns < 2) {
					return;
				}
				this._lastX = x;
				if (Modernizr.csstransforms3d) {
					this.$itemWrap.css('transform', "translate3d(" + x + '%, 0px, 0)');
				} else {
					this.$itemWrap.css('left', (x * 4) + '%');
				}
				this.updateCurrent(-this.targetOffset);
			},

			renderTime : function () {
				var time = Math.round(360 - Easing.lerpEaseInOut(0, 1, this.timeToNext / TIME_BETWEEN_FRAMES) * 360);
				if (!this.isTicking) {
					time = 360;
				}
				time = Math.min(360, Math.max(0, time));
				if (time > 180) {
					this.$icons.addClass('over180');
				} else {
					this.$icons.removeClass('over180');
				}
				this.$timers.css('transform', 'rotate(' + time + 'deg)');
			},

			/************************************
				Current
			************************************/

			_current : null,
			updateCurrent : function (current) {
				if (this._current === current) {
					return;
				}
				this._current = current;
				this.currentModel = this.models[current];
				this.$icons.removeClass('active').eq(current).addClass('active');
				this.renderCurrentDetail();
			},

			renderCurrentDetail : function () {
				var model = this.currentModel,
					cssClass = model.get('css_class') || '';
				this.detail.removeClass().addClass('detail ' + cssClass);
				this.inner.html(model.renderDetail());
			},

			route : function () {
				return this.currentModel.get('relative_url');
			},

			/************************************
				Mouse Down
			************************************/

			_onMouseDown : function (e) {
				var offset = this.$icons.index(e.currentTarget);
				this.targetOffset = -offset;
				this.stopTimer();
				e.stopPropagation();
			},

			/************************************
				Update
			************************************/

			tick : function (delta) {
				if (this.count > 1) {
					this.updateOffset();
					this.updateTimer(delta);
				}
				return this.sup(delta);
			},

			updateOffset : function () {
				if (this.isMoving) {
					return;
				}
				this.offset = Easing.lerp(this.offset, this.targetOffset, 0.25);
				this.renderOffset();
			},

			/************************************
				Timer
			************************************/

			isTicking : true,
			timeToNext : TIME_BETWEEN_FRAMES,
			updateTimer : function (delta) {
				if (!this.isTicking) {
					return;
				}
				this.timeToNext = (this.timeToNext || TIME_BETWEEN_FRAMES) - delta;
				if (this.timeToNext < 0) {
					this.timeToNext = TIME_BETWEEN_FRAMES;
					this.targetOffset = -((-this.targetOffset + 1) % this.count);
				}
				this.renderTime();
			},

			stopTimer : function () {
				if (this.isTicking) {
					this.isTicking = false;
					this.renderTime();
				}
			},

			/************************************
				Move to foreground / midground / background
			************************************/

			show : function () {
				var i;
				if (this.currentModel.get('post_type') === "feat_hashtag") {
					FilterSearch.searchFromQuery(this.currentModel.get('qs'));
					return;
				}
				// Atlas Tracking
				i = new Image();
				i.src = 'http://view.atdmt.com/action/SMG_MRTINX_CF_Tiles';

				// moved to views/grid/Post.js
				// if (this.currentModel.get('post_type') === "feat_video") {
				//	i = new Image();
				//	i.src = 'http://view.atdmt.com/action/SMG_MRTINX_CF_Trailer_VideoPlay';
				// }

				this.publish("track.event", {
					category : "Featured Content",
					label : this.currentModel.get_relative_url(),
					action : "Opens Main Promo",
					value : 1
				});
				// End Atlas Tracking
				this.sup();
			},

			moveToForeground : function () {
				this.sup();
				this.stopTimer();
			},

			moveToBackground : function () {
				this.sup();
				this.stopTimer();
			},

			/************************************
				Columns
			************************************/

			setColumns : function (cols) {
				this.sup(cols);
				if (cols === 1) {
					this.$itemWrap.css('transform', "");
				}
			},

			/************************************
				Gestures
			************************************/

			isMoving : false,
			offset : 0,
			targetOffset : 0,

			startGesture : function (x, y) {
				if (this.isForeground() || this.count < 2) {
					this.sup(x, y);
				}
			},

			moveGestureXY : function (x, y) {
				if (this.count < 2) {
					this.sup(x, y);
					return;
				}
				if (this.isForeground()) {
					return;
				}
				this.isMoving = true;
				this.offset = this.offset + (x / this.width());
				if (x > 0) {
					this.targetOffset = Math.ceil(this.offset);
				} else if (x < 0) {
					this.targetOffset = Math.floor(this.offset);
				}
				this.targetOffset = Easing.clamp(-(this.count - 1), 0, this.targetOffset);
				this.renderOffset();
				this.stopTimer();
			},

			moveGestureToXY : function (x, y) {
				if (this.isForeground() || this.count < 2) {
					this.sup(x, y);
				}
			},

			endGesture : function () {
				if (this.isForeground() || this.count < 2) {
					this.sup();
				} else {
					this.isMoving = false;
				}
			}

		});
	}
);
