define(
	[
		"./Slideshow",
		"$",
		"$plugin!easing"
	],

	function (Slideshow, $, $easing) {

		"use strict";

		return Slideshow.extend({

			// extended to include details blinds
			$castDetails : null,
			$detailsTitle : null,
			$detailsMore : null,
			$content : null,

			scrollTop : 0,
			scrollTopBoundary : 0,

			height : 0,
			heightBoundary : 0,
			updateText : false,

			nextData : null,

			init : function ($hitArea, callBack) {
				this.$details = $hitArea.find(".details");

				this.$castDetails = $hitArea.find(".cast-details");
				this.$content = this.$castDetails.find(".content");
				this.$detailsTitle = this.$castDetails.find(".section-title");
				this.$detailsMore = this.$castDetails.find(".more");
				this.sup.apply(this, arguments);

				this.onResize();
			},

			onResize : function (e, updateBoundary) {
				this.$castDetails.css("height", ""); // reset

				if (this.$target.width() > this.$target.height()) { // landscape
					this.heightBoundary = this.$castDetails.outerHeight(true);
				} else { // portrait
					this.heightBoundary = this.$details.outerHeight(true) + this.$detailsTitle.outerHeight(true) + 45;
				}

				if (!updateBoundary) {
					this.$castDetails[0].style.height =  this.heightBoundary + "px";
				}
			},

			start : function () {
				var next;

				this.updateText = false;
				this.revert = $.extend(this.revert, {
					dMore : this.$detailsMore.html(),
					dTitle : this.$detailsTitle.text()
				});

				this.scrollTopBoundary = parseInt(this.$content.scrollTop(), 10);

				this.sup.apply(this, arguments);

				next = this.$list.eq(this.index);

				this.nextData = $.extend(this.nextData, {
					dTitle : next.attr("title"),
					dMore : next.data("more")
				});
			},


			calculateWithEasing : function () {
				this.sup.apply(this, arguments);

				// not as performant to run while easing...
				if (this.percEased < 0.5) { // closing
					if (this.updateText) {
						this.updateText = false;
						this.$detailsTitle.text(this.revert.dTitle);
						this.$detailsMore.html(this.revert.dMore);
						this.onResize(null, true);
					}

					this.height = this.heightBoundary - (this.percEased * this.heightBoundary * 2);

				} else { // opening

					if (!this.updateText) {
						this.updateText = true;
						this.$detailsTitle.text(this.nextData.dTitle);
						this.$detailsMore.html(this.nextData.dMore);
						this.onResize(null, true);
					}

					this.height = (this.percEased - 0.5) * this.heightBoundary * 2;
				}

				this.scrollTop = this.scrollTopBoundary - (this.percEased * this.scrollTopBoundary);
			},

			update : function (time) {
				this.sup.apply(this, arguments);

				this.$castDetails[0].style.height = this.height + "px";
				this.$content.scrollTop(this.scrollTop);
			},

			destroy : function () {
				this.nextData = null;
				this.sup.apply(this, arguments);
			},
		});

	}
);
