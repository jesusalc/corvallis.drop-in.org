/*
	////////////////// JS requirements
	Modernizr
		cssmask custom test
		inlinesvg custom test
	//////////////////

	////////////////// CSS
	[data-copy] {
		position:relative;
	}
	[data-copy]:after {
		content: attr(data-copy);
		pointer-events: none;
		position: absolute;
		left: 0;
		top: 0;
		color: #ed9f3b;
		-webkit-mask-image: -webkit-gradient(linear, left top, right bottom,
			color-stop(0%, rgba(#000, 0.8)),
			color-stop(30%, rgba(#000, 0.1)),
			color-stop(40%, rgba(#000, .8)),
			color-stop(70%, rgba(#000, .2)),
			color-stop(100%, rgba(#000, 1))
		);
	}
	/////////////////////
 */
(function ($) {

	"use strict";

	/*global Modernizr */

	$.fn.textGradient = function(gradient) {
		var targ,
			data,
			svg,
			h,
			w;

		gradient = gradient || ['<defs>',
									'<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">',
										'<stop offset="0%" style="stop-color:#ffeab4; stop-opacity:1" />',
										'<stop offset="30%" style="stop-color:#ed9f3b; stop-opacity:1" />',
										'<stop offset="40%" style="stop-color:#ed9f3b; stop-opacity:1" />',
										'<stop offset="70%" style="stop-color:#ffeab4; stop-opacity:1" />',
										'<stop offset="100%" style="stop-color:#ed9f3b; stop-opacity:1" />',
									'</linearGradient>',
								'</defs>'].join("");

		return this.each(function(){
			targ = $(this);
			data = targ.data();

			if (Modernizr.cssmask) { // if webkit, add attr-copy-after

				targ.attr("data-copy", targ.text()).addClass("gradient")

			} else if (Modernizr.inlinesvg) { // use inline-svg and apply external svg as fill

				h = targ.height();
				w = targ.width();

				svg = [
						 '<svg class="svg" width="' + w + '" height="' + h + '">',
						 	gradient,
							'<text fill="url(#gradient)" y="' + (h - 5) + '">' + targ.text() + '</text>',
						'</svg>'
					].join("");

				targ.replaceWith(svg);
			}
		});
	};
}(jQuery));
