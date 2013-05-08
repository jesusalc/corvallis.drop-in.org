define(

	[
		"rosy/base/DOMClass",
		"$",
		"$plugin!transit",
		"$plugin!mousewheel"
	],

	function (DOMClass, $) {

		"use strict";

		/*global Modernizr */

		var $doc = $(document),
			$window = $(window);

		return DOMClass.extend({

			/**
			* EVENTS:
			*
			* - minX
			* - minY
			* - maxX
			* - maxY
			* - scroll
			* - next
			* - prev
			**/

			width : 0,
			height : 0,

			scrollWidth : 0,
			scrollHeight : 0,

			scrollbarWidth : 0,
			scrollbarHeight: 0,

			scrollbarX : 0,
			scrollbarY : 0,
			scrollbarProportion : 0,

			scrollX : 0,
			scrollY : 0,

			minX : 0,
			minY : 0,

			maxX : 0,
			maxY : 0,

			opts : {
				scrollbar : true,
				mousewheel : true,
				touch : true,
				scrollMode : "scroll", // "drag", "move", "none"
				direction : "vertical", // "vertical", "horizonal"
				infinite : false,
				stepSize : 300,
				css3 : true,
				fallback : true,
				mousewheelFactor : 20,
				bubble : false,

				duration : 300,
				delay : 0,
				easing : "in-out",

				centerX : false,
				centerY : false,
				resizeHandle : true
			},

			setClassesTimeoutID : null,

			activeClasses : null,
			inactiveClasses : null,

			touchStartTime : 0,
			touchStartX : 0,
			touchStartY : 0,

			touchMoveCount : 0,
			touchEvent : null,
			touchTarget : null,

			dragStartX : 0,
			dragStartY : 0,

			origClasses : null,
			resizeTimeoutID : null,

			init : function (content, opts) {

				var i,
					l,
					p;

				this.$ = {
					parent : null,
					content : null,
					scrollbar : null
				};

				this.activeClasses = this.inactiveClasses = [];

				if (opts) {
					for (p in opts) {
						this.opts[p] = opts[p];
					}
				}

				this.$.content = $(content);
				this.$.parent = this.$.content.parent();

				this.$.container = $(opts.container) || this.$.parent;

				this.origClasses = this.$.container.attr("class");

				if (this.opts.scrollbar) {

					this.$.scrollbar = $('<div class="scrollbox-bar"></div>');
					this.$.scrollbar.track = $('<div class="scrollbox-track"></div>');
					this.$.scrollbar.handle = $('<div class="scrollbox-handle"></div>');

					this.$.scrollbar.addClass(this.opts.direction);

					this.$.scrollbar.append(this.$.scrollbar.track);
					this.$.scrollbar.append(this.$.scrollbar.handle);

					this.$.parent.append(this.$.scrollbar);
				}

				this.$.parent.addClass("scrollbox")
					.css({
						overflow : "hidden"
					});

				this.scrollX = 0;
				this.scrollY = 0;

				this.center();
				this.updateDimensions();
				this.addListeners();

				this.sup();
			},


			hideScrollBar : function () {
				this.$.scrollbar.transition({
					opacity : 0,
					delay : 0,
					queue : false
				}, 200, "in-out");
			},

			showScrollBar : function () {
				this.$.scrollbar.transition({
					opacity : 1,
					delay : 0,
					queue : false
				}, 200, "in-out");
			},

			scrollTo : function (x, y, opts, callback) {

				var p,
					$el,
					minX = this.minX,
					minY = this.minY,
					maxX = this.maxX,
					maxY = this.maxY,
					classesToAdd = [],
					classesToRemove = [],
					scrollbarX,
					scrollbarY;

				if (typeof opts === "function") {
					callback = opts;
					opts = null;
				}

				opts = opts || {};
				opts.callback = callback;

				for (p in this.opts) {
					if (typeof opts[p] === "undefined") {
						opts[p] = this.opts[p];
					}
				}

				x = parseInt(x, 10);
				y = parseInt(y, 10);

				x = isNaN(x) ? this.scrollX : x;
				y = isNaN(y) ? this.scrollY : y;

				if (opts.ignoreBounds) {
					minX = maxX = x;
					minY = maxY = y;
				}

				x = Math.max(Math.min(x, minX), maxX);
				y = Math.max(Math.min(y, minY), maxY);

				if (x !== this.scrollX || y !== this.scrollY || opts.force) {

					scrollbarX = -(x * this.scrollbarProportion);
					scrollbarY = -(y * this.scrollbarProportion);

					if (opts.duration === 0) {

						this.$.content.css({
							"transform" : this.transform(x, y)
						});

						this.$.content.find(".fixed").each(function (i, el) {
							$el = $(el);

							$(this).css({
								"transform" : this.transform(x - (x * 2), y - (y * 2))
							});
						});

						if (this.opts.scrollbar) {

							this.$.scrollbar.handle.css({
								"transform" : this.transform(scrollbarX, scrollbarY)
							});
						}

						if (opts.callback) {
							opts.callback();
						}
					}

					else {
						this.$.content.transition(
							{
								transform : this.transform(x, y),
								queue : opts.queue || false,
								delay : opts.delay,
								duration : opts.duration,
								easing : opts.easing
							},
							opts.callback
						);

						if (this.opts.scrollbar) {
							this.showScrollBar();
							this.$.scrollbar.handle.transition(
								{
									transform : this.transform(scrollbarX, scrollbarY),
									delay : opts.delay,
									queue : false,
									duration : opts.duration,
									easing : opts.easing
								}
							);
						}
					}


					this.scrollX = isNaN(x) ? 0 : x;
					this.scrollY = isNaN(y) ? 0 : y;

					this.scrollbarX = scrollbarX;
					this.scrollbarY = scrollbarY;

					this.trigger("scroll");

					(this.scrollX >= this.minX ? classesToAdd : classesToRemove).push("min-x");
					(this.scrollY >= this.minY ? classesToAdd : classesToRemove).push("min-y");
					(this.scrollX <= this.maxX ? classesToAdd : classesToRemove).push("max-x");
					(this.scrollY <= this.maxY ? classesToAdd : classesToRemove).push("max-y");

					if (this.opts.direction === "vertical") {

						if (this.scrollHeight <= this.height) {
							classesToAdd.push("no-scroll");
							classesToRemove.push("scroll");
						}

						else {
							classesToRemove.push("no-scroll");
							classesToAdd.push("scroll");
						}
					}

					else {

						if (this.scrollWidth <= this.width) {
							classesToAdd.push("no-scroll");
							classesToRemove.push("scroll");
						}

						else {
							classesToRemove.push("no-scroll");
							classesToAdd.push("scroll");
						}
					}

					this.setClasses(classesToAdd, classesToRemove);
				}
			},

			next : function () {

				var x = this.scrollX,
					y = this.scrollY;

				if (this.opts.direction === "horizontal") {
					x += this.opts.stepSize;
				}

				else {
					y += this.opts.stepSize;
				}

				this.scrollTo(x, y);
				this.trigger("next");
			},

			prev : function () {

				var x = this.scrollX,
					y = this.scrollY;

				if (this.opts.direction === "horizontal") {
					x -= this.opts.stepSize;
				}

				else {
					y -= this.opts.stepSize;
				}

				this.scrollTo(x, y);
				this.trigger("prev");
			},

			updateDimensions : function (scrollWidth, scrollHeight) {

				var proportion,
					barSize,
					sbTransProps;

				this.width = this.$.parent.width();
				this.height = this.$.parent.height();

				this.scrollWidth = scrollWidth || this.$.content.width();
				this.scrollHeight = scrollHeight || this.$.content.height();

				this.maxX = -Math.max(this.minX, this.scrollWidth - this.width);
				this.maxY = -Math.max(this.minY, this.scrollHeight - this.height);

				if (this.opts.scrollbar) {

					this.scrollbarWidth = this.$.scrollbar.width();
					this.scrollbarHeight = this.$.scrollbar.height();

					proportion = this.opts.direction === "vertical" ? this.scrollbarHeight / this.scrollHeight : this.scrollbarWidth / this.scrollWidth;

					if (isNaN(proportion)) {
						proportion = 1;
					}

					if (proportion !== this.scrollbarProportion) {

						this.scrollbarProportion = proportion;

						if (this.scrollbarProportion >= 1) {
							this.hideScrollBar();
						}

						else {
							this.showScrollBar();
						}

						barSize = Math.round(this.scrollbarProportion * (this.opts.direction === "vertical" ? this.height : this.width));

						if (isNaN(barSize)) {
							barSize = 100;
						}

						sbTransProps = {
							transform : this.transform(-(this.scrollX * this.scrollbarProportion), -(this.scrollY * this.scrollbarProportion)),
							queue : false,
							delay : 0
						};

						if (this.opts.resizeHandle) {
							sbTransProps[(this.opts.direction === "vertical" ? "height" : "width")] = barSize + "px";
						}

						this.$.scrollbar.handle.transition(sbTransProps, 300, "snap");
					}
				}

				this.scrollTo(this.scrollX, this.scrollY, {duration : 0, force: true});
			},

			setClasses : function (classesToAdd, classesToRemove) {

				classesToAdd = classesToAdd || [];
				classesToRemove = classesToRemove || [];

				this.activeClasses = this.activeClasses || [];
				this.inactiveClasses = this.inactiveClasses || [];

				if (classesToAdd.toString() !== this.activeClasses.toString() || classesToRemove.toString() !== this.inactiveClasses.toString()) {

					this.activeClasses = classesToAdd;
					this.inactiveClasses = classesToRemove;

					if (this.activeClasses.indexOf("min-x") >= 0) {
						this.trigger("minX");
					}

					if (this.activeClasses.indexOf("min-y") >= 0) {
						this.trigger("minY");
					}

					if (this.activeClasses.indexOf("max-x") >= 0) {
						this.trigger("maxX");
					}

					if (this.activeClasses.indexOf("max-y") >= 0) {
						this.trigger("maxY");
					}
				}

				if (this.setClassesTimeoutID) {
					window.clearTimeout(this.setClassesTimeoutID);
				}

				this.setClassesTimeoutID = this.setTimeout(function () {
					this.$.container.removeClass(this.inactiveClasses.join(" ")).addClass(this.activeClasses.join(" "));
				}, 100);
			},

			center : function () {

				var x = this.scrollX,
					y = this.scrollY;

				if (this.opts.centerX && this.scrollWidth < this.width) {
					x = (this.width - this.scrollWidth) * 0.5;
					this.$.container.addClass("centered-x");
				}

				if (this.opts.centerY && this.scrollHeight < this.height) {
					y = (this.height - this.scrollHeight) * 0.5;
					this.$.container.addClass("centered-y");
				}

				if (x !== this.scrollX || y !== this.scrollY) {
					this.$.content.css({
						"transform" : this.transform(x, y)
					});
				}
			},

			checkDimensions : function () {
				var scrollWidth = this.$.content.width(),
					scrollHeight = this.$.content.height();

				if (scrollWidth !== this.scrollWidth || scrollHeight !== this.scrollHeight) {
					this.updateDimensions();
				}

				this.center();
			},

			onScroll : function (e, delta, deltaX, deltaY) {

				var x,
					y;

				if (this.opts.direction === "horizontal") {
					deltaY = delta;
				}

				x = this.opts.direction === "horizontal" ? this.scrollX + (deltaY * this.opts.mousewheelFactor) : this.scrollX;
				y = this.opts.direction === "vertical" ? this.scrollY + (deltaY * this.opts.mousewheelFactor) : this.scrollY;

				this.scrollTo(x, y, {duration : 0});

				if (!this.opts.bubble) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			},

			onClick : function (e) {
				if (!this.touchEvent) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			},

			onTouchStart : function (e) {
				// console.log("b");
				var o = e.originalEvent || e;

				if (o.target.tagName.match(/input|textarea|select/i)) {
					return;
				}

				this.touchStartTime = o.timeStamp || 0;
				this.touchStartX = o.pageX;
				this.touchStartY = o.pageY;

				this.touchEvent = e;
				this.touchTarget = e.target;
				this.touchMoveCount = 0;

				$doc.on("touchmove MSPointerMove", this.onTouchMove);
				$doc.on("touchend MSPointerUp", this.onTouchEnd);
				$doc.on("touchcancel", this.onTouchEnd);

				if (!this.opts.bubble) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			},

			onTouchMove : function (e) {

				var x = this.scrollX,
					y = this.scrollY,
					o = e.originalEvent || e,
					xDiff = this.touchStartX - o.pageX,
					yDiff = this.touchStartY - o.pageY;

				if (this.opts.direction === "horizontal" && Math.abs(xDiff) > Math.abs(yDiff)) {
					x = this.scrollX - (xDiff * 1.5);
				}

				else if (this.opts.direction === "vertical" && Math.abs(yDiff) > Math.abs(xDiff)) {
					y = this.scrollY - (yDiff * 1.5);
				}

				this.touchStartX = o.pageX;
				this.touchStartY = o.pageY;
				this.touchMoveCount ++;

				this.scrollTo(x, y, {duration : 0});

				if (!this.opts.bubble) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			},

			onTouchEnd : function (e) {
				var o = e.originalEvent || e;
				$doc.off("touchmove MSPointerMove", this.onTouchMove);
				$doc.off("touchend MSPointerUp", this.onTouchEnd);
				$doc.off("touchcancel", this.onTouchEnd);

				if (this.touchMoveCount <= 3) {

					if (document.createEvent) {
						var dispatch = document.createEvent("HTMLEvents");
						dispatch.initEvent("click", true, true);
						this.touchTarget.dispatchEvent(dispatch);
					}

					else {
						$(this.touchTarget).trigger("click");
					}

					this.touchEvent = null;
				}

				if (!this.opts.bubble) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			},

			onTrackClick : function (e) {

				var percent,
					diff,
					handleSize,
					offset = this.$.scrollbar.track.offset(),
					x = e.pageX - offset.left,
					y = e.pageY - offset.top;

				if (this.opts.direction === "vertical") {
					percent = y / this.scrollbarHeight;
					diff = this.maxY - this.minY;
					this.scrollTo(this.scrollX, this.minY + (diff * percent));
				}

				else {
					percent = x / this.scrollbarWidth;
					diff = this.maxX - this.minX;
					this.scrollTo(this.minX + (diff * percent), this.scrollY);
				}

			},

			onHandleDragStart : function (e) {
				$doc.on("mousemove", this.onHandleDragMove);
				$doc.on("mouseup", this.onHandleDragStop);

				this.dragStartX = e.pageX;
				this.dragStartY = e.pageY;

				e.preventDefault();
				e.stopPropagation();
				return false;
			},

			onHandleDragMove : function (e) {

				var x = this.scrollX,
					y = this.scrollY,
					sbX = this.scrollbarX,
					sbY = this.scrollbarY,
					xDiff = 0,
					yDiff = 0;

				sbX = this.opts.direction === "horizontal" ? sbX - (this.dragStartX - e.pageX) : sbX;
				sbY = this.opts.direction === "vertical" ? sbY - (this.dragStartY - e.pageY) : sbY;

				xDiff = sbX - this.scrollbarX;
				yDiff = sbY - this.scrollbarY;

				this.dragStartX = e.pageX;
				this.dragStartY = e.pageY;

				this.scrollbarX = x;
				this.scrollbarY = y;

				this.scrollTo(x - (xDiff / this.scrollbarProportion), y - (yDiff / this.scrollbarProportion), {duration : 0});

				e.preventDefault();
				e.stopPropagation();
				return false;
			},

			onHandleDragStop : function (e) {
				$doc.off("mousemove", this.onHandleDragMove);
				$doc.off("mouseup", this.onHandleDragStop);

				e.preventDefault();
				e.stopPropagation();
				return false;
			},


			onResize : function () {
				if (this.resizeTimeoutID) {
					window.clearTimeout(this.resizeTimeoutID);
					this.resizeTimeoutID = null;
				}

				this.resizeTimeoutID = this.setTimeout(this.updateDimensions, 300);
			},

			transform : function (x, y, z) {
				x = x || 0;
				y = y || 0;
				z = z || 0;

				if (window.Modernizr.csstransforms3d) {
					return "translate3d(" + [x, y, z].join("px, ") + "px)";
				}

				else {
					return "translate(" + [x, y].join("px, ") + "px)";
				}
			},

			addListeners : function () {

				$window.on("resize", this.onResize);

				this.dimensionsInterval = this.setInterval(this.checkDimensions, 200);

				if (this.opts.mousewheel) {
					this.$.parent.on("mousewheel", this.onScroll);
				}

				if (this.opts.touch) {
					this.$.parent.on("touchstart mousedown MSPointerDown", this.onTouchStart);
					this.$.container.on("click", this.onClick);
				}

				if (this.opts.scrollbar) {
					this.$.scrollbar.on("click", ".scrollbox-track", this.onTrackClick);
					this.$.scrollbar.on("mousedown", ".scrollbox-handle", this.onHandleDragStart);
				}
			},

			removeListeners : function () {

				$window.off("resize", this.onResize);
				window.clearInterval(this.dimensionsInterval);

				if (this.opts.mousewheel) {
					this.$.parent.off("mousewheel", this.onScroll);
				}

				if (this.opts.touch) {
					this.$.parent.off("touchstart MSPointerDown", this.onTouchStart);
					$doc.off("touchmove MSPointerMove", this.onTouchMove);
					$doc.off("touchend MSPointerUp", this.onTouchEnd);
				}

				if (this.opts.scrollbar) {
					this.$.scrollbar.off("click", ".scrollbox-track", this.onTrackClick);
					this.$.scrollbar.off("mousedown", ".scrollbox-handle", this.onHandleDragStart);
				}
			},

			destroy : function () {
				this.removeListeners();

				if (this.opts.scrollbar && this.$.scrollbar) {
					this.$.scrollbar.remove();
				}

				this.$.parent.attr("class", this.origClasses);

				this.$ = null;

				this.sup();
			}
		});
	}
);
