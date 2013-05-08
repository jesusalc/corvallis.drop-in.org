/*jshint bitwise:false*/
define(function (require, exports, module) {

	"use strict";

	var Class = require("rosy/base/Class"),
		raf = require("rosy/polyfills/request-animation-frame"),
		rafBuffer = require("../../utils/RequestAnimationFrameBuffer"),
		$ = require("$"),
		GridGestures = require("./GridGestures"),
		GridStorage = require("./GridStorage"),
		BlockCache = require("./BlockCache"),
		Block = require("./Block"),

		$main = $('.main'),
		$html = $('html');

	module.exports = Class.extend({

		dom : null,

		grid : null,
		blocks : null,
		oldBlocks : null,
		blockKeys : null,
		columns : 6,

		y : null,
		windowHeight : 0,
		windowWidth : 0,
		canEdit : false,

		loader : $(),

		init : function (dom) {
			this.dom = dom;
			this.detail = $('<div>').addClass('grid-detail').insertAfter(dom);
			this.grid = new GridStorage();
			this.gestures = new GridGestures(this.dom, this.detail, this);
			this.blocks = [];
			this.oldBlocks = [];
			this.blockKeys = {};
			this.reset();

			this.loader = $('.loader');

			BlockCache.on('add', this.addFromCache);

			// resize
			$(window).on('resize', rafBuffer(this.onResize));
			$(document).on('scroll', rafBuffer(this.onScroll));
			this.onResize();
			this.onScroll();

			// close
			this.detail.on('click', '[data-close="true"]', this.hide);

			// start timer
			this.tick();
		},

		/************************************
			Resize
		************************************/

		onResize : function () {
			var i,
				windowHeight = this.windowHeight = this.gestures.windowHeight = $(window).height(),
				windowWidth = this.windowWidth = this.gestures.windowWidth = $(window).width();

			for (i = 0; i < this.blocks.length; i++) {
				this.blocks[i].setGlobalWidthHeight(windowWidth, windowHeight);
				this.blocks[i].snapToTarget();
			}

			this.recalcColumns();
			this.updatePerspective();
		},

		onScroll : function () {
			var scroll = $(document).scrollTop(),
				distance = this.height() - (scroll + this.windowHeight),
				i;
			if (distance < 500) {
				this.trigger('scroll-to-bottom');
			}
			for (i = 0; i < this.blocks.length; i++) {
				this.blocks[i].scrollList(scroll);
			}
		},

		height : function () {
			if (this.columns === 1) {
				return this.dom.height();
			}
			return (this.grid.length() / this.columns * this.windowWidth);
		},

		updatePerspective : function () {
			var detail = $(document).scrollTop() + (this.windowHeight / 2);
			this.detail.css('perspective-origin', ~~(this.windowWidth / 2) + 'px 50%');
			this.dom.css('perspective-origin', "50% " + ~~detail + 'px');
		},

		targetColumns : 0,
		recalcColumns : function () {
			var cols = Math.round(this.windowWidth / 350) * 2,
				fontSize;

			this.targetColumns = cols;

			cols += this._zoom;
			cols = Math.min(12, Math.max(2, cols));

			if (this.windowWidth < 569) {
				cols = 1;
			}

			fontSize = Math.round(this.windowWidth / (cols * 12));

			this.setColumns(cols);
			if (this.columns > 1) {
				this.dom.height(this.height());
			}
			this.dom.css('font-size', fontSize);
		},

		/************************************
			Zooming
		************************************/

		_zoom : 0,
		zoomIn : function () {
			this._zoom = Math.min(2, this._zoom + 2);
			this.recalcColumns();
		},

		zoomOut : function () {
			this._zoom = Math.max(2 - this.targetColumns, this._zoom - 2);
			this.recalcColumns();
		},

		/************************************
			Tick
		************************************/

		_lastTick : 0,
		tick : function (time) {
			this._tick(time);
			raf(this.tick);
		},
		_tick : function (time) {
			var i,
				delta = (time - this._lastTick) || 0;
			this._lastTick = time;
			for (i = 0; i < this.blocks.length; i++) {
				this.blocks[i].tick(delta);
			}
			for (i = 0; i < this.oldBlocks.length; i++) {
				if (this.oldBlocks[i].isDetached(delta)) {
					this.oldBlocks.splice(i, 1);
					i--;
				}
			}
			if (this._shouldHideLoader) {
				this.loader.addClass('hidden');
			}
		},

		/************************************
			Show / Hide
		************************************/

		_isBackground : false,
		show : function (block, instant) {
			var i;
			if (this.columns === 1) {
				return; // never navigate to the detail on single col
			}
			for (i = 0; i < this.blocks.length; i++) {
				if (this.blocks[i] !== block) {
					this.blocks[i].moveToBackground(instant);
				}
			}
			if (block) {
				block.moveToForeground();
				this.trigger('show', block);
			}
			$html.addClass('no-scroll');
			this.updatePerspective();
			this._isBackground = true;
		},

		hide : function () {
			var i;
			for (i = 0; i < this.blocks.length; i++) {
				this.blocks[i].moveToMidground();
			}
			$html.removeClass('no-scroll');
			this.trigger('hide');
			this._isBackground = false;
		},

		route : function () {
			return "/";
		},

		/************************************
			Columns
		************************************/

		setColumns : function (columns) {
			this.columns = columns;
			this.grid.setColumns(columns);
			if (columns === 1) {
				this.dom.addClass('is-one-column').css('height', '');
				this.detail.addClass('is-one-column');
				$html.removeClass('no-scroll');
			} else {
				this.dom.removeClass('is-one-column');
				this.detail.removeClass('is-one-column');
			}
		},

		/************************************
			Managing Posts
		************************************/

		reset : function () {
			while (this.blocks && this.blocks.length) {
				this.oldBlocks.push(this.blocks.pop());
			}
			this.blockKeys = {};
			this._isBackground = false;
			this.grid.reset();
		},

		isFirstAddition : true,
		addPosts : function (posts) {
			var i,
				delay = this.isFirstAddition ? 50 : 0;

			posts = BlockCache.addMany(posts);

			for (i = 0; i < posts.length; i++) {
				this.addFromModel(posts[i], i * delay);
			}

			this.isFirstAddition = false;

			// check scrolling so that if the viewport wasn't big enough to
			// need to scroll, we can still get more than one page of results
			this.onScroll();
			this._tick();
			this._shouldHideLoader = true;
		},

		addFromCache : function (e, n, block) {
			this.addFromModel(block);
		},

		addFromModel : function (blockModel, i) {
			var id = blockModel.get('network') + blockModel.get('primary_key'),
				block;
			if (this.blockKeys[id]) {
				return;
			}
			blockModel.set("can_edit", this.canEdit);
			block = new Block(blockModel);

			this.blockKeys[id] = block;
			this.add(block, i);
		},

		add : function (block, i) {
			block.grid = this;
			block.setGlobalWidthHeight(this.windowWidth, this.windowHeight);
			block.setInitialDelay(i);
			block.scrollList(this.y);
			if (this._isBackground) {
				block.moveToBackground(true);
			}
			this.removeFromOldBlocks(block);
			this.blocks.push(block);
			this.grid.add(block);
			block.moveToInitial();
			this.dom.append(block.dom);
			block.tick(16);
			if (this.columns > 1) {
				this.dom.height(this.height());
			}
		},

		removeFromOldBlocks : function (block) {
			var i;
			for (i = 0; i < this.oldBlocks.length; i++) {
				if (this.oldBlocks[i] === block) {
					this.oldBlocks.splice(i, 1);
					i--;
				}
			}
		}

	});
});
