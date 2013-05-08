/*jshint bitwise:false*/
define(function (require, exports, module) {

	"use strict";

	var Class = require("rosy/base/Class");

	return Class.extend({

		grid : null,
		blocks : null,
		columns : 6,

		init : function () {
			this.blocks = [];
			this.grid = [];
		},

		/************************************
			Columns
		************************************/

		setColumns : function (columns) {
			var i, block;
			if (columns === this.columns) {
				return;
			}
			this.columns = columns;
			this.clear();
			for (i = 0; i < this.blocks.length; i++) {
				block = this.blocks[i];
				block.setColumns(columns);
				this.findPlace(block, i);
			}
		},

		/************************************
			Managing Posts
		************************************/

		reset : function () {
			this.clear();
			this.blocks = [];
		},

		length : function () {
			var c, r, isEmpty;
			for (c = 0; c < this.grid.length; c++) {
				isEmpty = true;
				for (r = 0; r < this.grid[c].length; r++) {
					if (this.grid[c][r]) {
						isEmpty = false;
						break;
					}
				}
				if (isEmpty) {
					return c;
				}
			}
			return this.grid.length;
		},

		add : function (block) {
			this.blocks.push(block);
			block.setColumns(this.columns);
			this.findPlace(block);
		},

		clear : function () {
			var c, r;
			for (c = 0; c < this.grid.length; c++) {
				for (r = 0; r < this.grid[c].length; r++) {
					this.grid[c][r] = false;
				}
			}
			this.firstEmpty = 0;
		},

		firstEmpty : 0,
		findPlace : function (block, index) {
			var x, y,
				halfWidth = (this.columns / 2),
				h = Math.min(block.rows, halfWidth),
				w = Math.min(block.cols, halfWidth),
				maxX = halfWidth + 1 - w,
				maxY = this.grid.length + h;

			for (y = this.firstEmpty; y < maxY; y++) {
				for (x = 0; x < maxX; x++) {
					if (this.place(block, x, y, index)) {
						return;
					}
					if (this.columns > 1 && this.place(block, x + halfWidth, y, index)) {
						return;
					}
				}
			}
		},

		updateFirstRow : function () {
			var x, y, hasEmpty;
			for (y = this.firstEmpty; y < this.grid.length; y++) {
				hasEmpty = false;
				for (x = 0; x < this.columns; x++) {
					if (!this.grid[y][x]) {
						hasEmpty = true;
					}
				}
				if (hasEmpty) {
					this.firstEmpty = Math.max(0, y - 1);
					return;
				}
			}
		},

		place : function (block, x, y, index) {
			var i, j,
				halfWidth = (this.columns / 2),
				h = Math.min(block.rows, halfWidth),
				w = Math.min(block.cols, halfWidth);
			// check if we can place it
			for (i = 0; i < h; i++) {
				if (!this.grid[y + i]) {
					this.grid[y + i] = [];
				}
				for (j = 0; j < w; j++) {
					if (this.grid[y + i][x + j]) {
						return false;
					}
				}
			}
			// we can place it, do so now
			for (i = 0; i < h; i++) {
				for (j = 0; j < w; j++) {
					this.grid[y + i][x + j] = index || this.blocks.length;
				}
			}
			block.setRowCol(x / this.columns, y / this.columns);
			this.updateFirstRow();
			// return true so we know we placed the block
			return true;
		},

		logGrid : function () {
			var c, r, o;
			for (c = 0; c < this.grid.length; c++) {
				o = "";
				for (r = 0; r < this.grid[c].length; r++) {
					if (this.grid[c][r] < 10) {
						o += " ";
					}
					if (this.grid[c][r] < 100) {
						o += " ";
					}
					o += (this.grid[c][r] || 0) + " ";
				}
				window.console.log(o);
			}
		}

	});
});
