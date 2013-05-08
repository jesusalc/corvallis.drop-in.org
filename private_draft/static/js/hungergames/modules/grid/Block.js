/*jshint bitwise:false*/
define(

	[
		"rosy/base/Class",
		"$",
		"./BlockTransform",
		"./BlockCache",
		"./BlockModel"
	],

	function (Class, $, BlockTransform, BlockCache, BlockModel) {

		"use strict";

		return Class.extend({

			dom : null,
			detail : null,
			grid : null,
			model : null,

			init : function (data) {
				this.sup();

				this.transform = new BlockTransform();
				this.transform.dom = this.dom = $('<div>').data('block', this);
				this.transform.detail = this.detail = $('<div>').data('block', this);
				this.inner = $('<div>').addClass('detail-inner').appendTo(this.detail);
				this.transform.block = this;

				this.setWidthHeight(1, 1);

				if (data) {
					if (data instanceof BlockModel) {
						this.model = data;
					} else {
						this.model = BlockCache.addOne(data);
					}
					this.setWidthHeight.apply(this, this.model.get('width_height'));
					this.model.on('changeany', this.render);
					this.model.on('show', this.show);
					this.model.on('hide', this.hide);
					this.render();
				}
			},

			setInitialDelay : function (d) {
				this.transform.setInitialDelay(d);
			},

			/************************************
				Rendering
			************************************/

			render : function () {
				var backgroundImage = this.get('background_image'),
					cssClass = this.get('css_class') || '';
				if (backgroundImage) {
					this.dom.addClass('has-background-image');
					this.dom.css('background-image', 'url(' + backgroundImage + ')');
				}
				this.dom.addClass('block ' + cssClass);
				this.detail.addClass('detail ' + cssClass);
				if (this.model) {
					this.dom.html(this.model.renderBlock());
					this.inner.html(this.model.renderDetail());
				}
			},

			/************************************
				Detail Data
			************************************/

			didLoadDetail : null,
			loadDetailData : function () {
				if (this.didLoadDetail) {
					return;
				}
				this.didLoadDetail = true;
				$.ajax(this.route() + '?format=json').done(this.proxy(function (data) {
					this.set(data.object);
				}));
			},

			/************************************
				Routing
			************************************/

			route : function () {
				return this.get('relative_url');
			},

			/************************************
				Models
			************************************/

			set : function () {
				if (this.model) {
					this.model.set.apply(this.model, arguments);
				}
			},

			get : function () {
				if (this.model) {
					return this.model.get.apply(this.model, arguments);
				}
			},

			/************************************
				Global Width
			************************************/

			_globalWidth : 0,
			_globalColumns : 6,

			setColumns : function (cols) {
				this._globalColumns = cols;
				this.maxRows = Math.ceil(cols / 2);
				this.widthHeightIsDirty = true;
				this.transform.isOneColumn = cols === 1;
				if (cols === 1) {
					this.dom.css('transform', '');
					this.detail.css('transform', '');
				} else {
					this.transform.render(true);
				}
			},

			setGlobalWidthHeight : function (width, height) {
				this.transform.setGlobalWidthHeight(width, height);
				this._globalWidth = width;
				this.widthHeightIsDirty = true;
			},

			snapToTarget : function () {
				this.transform.snapToTarget();
			},

			widthHeightIsDirty : true,

			maxRows : 3,
			rows : 1,
			cols : 1,

			row : 0,
			col : 0,

			setRowCol : function (row, col) {
				this.row = row;
				this.col = col;
				this.updateWidthHeight();
				this.widthHeightIsDirty = true;
			},

			setWidthHeight : function (w, h) {
				this.rows = h;
				this.cols = w;
				this.updateWidthHeight();
				this.widthHeightIsDirty = true;
			},

			width : function () {
				var a = Math.min(this.cols, this.maxRows);
				return Math.ceil(a * this._globalWidth / this._globalColumns) - 10;
			},

			height : function () {
				var a = Math.min(this.rows, this.maxRows);
				return Math.ceil(a * this._globalWidth / this._globalColumns) - 10;
			},

			detailHeight : function () {
				return this.detail.outerHeight();
			},

			updateWidthHeight : function () {
				var rowh = Math.min(this.rows, this.maxRows) / this._globalColumns,
					roww = Math.min(this.cols, this.maxRows) / this._globalColumns,
					h = rowh * this._globalWidth - 10,
					w = roww * this._globalWidth - 10,
					detailW = Math.ceil(this._globalWidth * (2 / 3)) - 40;

				if (this._globalColumns === 1) {
					this.dom.addClass('single-column').removeClass('hidden').css({
						width : '',
						height : '',
						marginLeft : ''
					});
				} else {
					this.dom.removeClass('single-column').css({
						width : ~~w,
						height : ~~h,
						marginLeft : -Math.ceil(w / 2)
					});
					this.detail.css({
						width : ~~detailW,
						marginLeft : -Math.ceil(detailW / 2)
					});
				}

				this.transform.setWidthHeight(~~w, ~~h);
				this.transform.setRowCol(this.row + roww / 2, this.col);

				this.widthHeightIsDirty = false;
			},

			/************************************
				Scroll
			************************************/

			scrollList : function (y) {
				this.transform.scrollList = y;
			},

			/************************************
				Tick
			************************************/

			tick : function (delta) {
				this.update();
				return this.transform.tick(delta);
			},

			isDetached : function (delta) {
				if (this._globalColumns === 1 || this.transform.isDetached(delta)) {
					this.detach();
					return true;
				}
			},

			update : function () {
				if (this.widthHeightIsDirty) {
					this.updateWidthHeight();
				}
			},

			/************************************
				Show / Hide
			************************************/

			moveToInitial : function () {
				this.transform.moveToInitial();
			},

			moveToMidground : function () {
				this.transform.moveToMid();
				this._isForeground = false;
				this.dom.removeClass('is-background is-foreground');
			},

			moveToForeground : function () {
				this.transform.moveToFront();
				this._isForeground = true;
				this.dom.removeClass('is-background').addClass('is-foreground');
			},

			moveToBackground : function (instant) {
				this.transform.moveToBack(instant);
				this._isForeground = false;
				this.dom.addClass('is-background').removeClass('is-foreground');
			},

			show : function () {
				this.loadDetailData();
				if (this.grid) {
					this.grid.show(this);
				}
			},

			hide : function () {
				if (this.grid) {
					this.grid.hide();
				}
			},

			_isForeground : false,
			isForeground : function () {
				return this._isForeground;
			},

			/************************************
				Gestures
			************************************/

			startGesture : function (x, y) {
				this.transform.startGesture(x, y);
			},

			moveGestureToXY : function (x, y) {
				this.transform.moveGestureToXY(x, y);
			},

			moveGestureXY : function (x, y) {

			},

			endGesture : function () {
				if (this.transform.shouldGoToForeground) {
					this.show();
				} else {
					this.hide();
				}
			},

			cancelGesture : function () {
				this.transform.moveToPrevious();
			},

			/************************************
				Destroy
			************************************/

			detach : function () {
				this.transform.detach();
			}

		});
	}
);
