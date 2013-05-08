define(
	[
		"./base/GalleryPage",
		"$"
	],

	function (GalleryPage, $) {

		"use strict";

		return GalleryPage.extend({

			minHeight : 400,
			minWidth : 400,

			xhr : null,
			url : null,

			$nextPerson : null,
			$person : null,
			$bio : null,

			setupDom : function () {
				this.sup();

				this.$list = this.dom.find("nav a");
				this.$person = this.dom.find("#person");
				this.$slideshow = this.$person.find(".slideshow");
				// this.$bio = this.$person.find(".bio");
			},

			getCurrentImage : function (slug) {
				var $targ = this.$list.filter('[data-slug="' + slug + '"]');

				this.url = $targ.attr("href");

				this.$list.removeClass("active"); // activate menu item
				$targ.addClass("active");

				this.index = $targ.parent().index(); // change index
			},

			update : function (params, data) {
				this.getCurrentImage(params.slug);
				if (this.xhr) {
					this.xhr.abort();
				}

				this.xhr = $.ajax({
					url: this.url,
					dataType: "html",
					success: $.proxy(function (response) { // use AJAX and manage ERRORS
							this.$nextPerson = $(response).find("#person");
							this.transitionContentOut();
						}, this),
					error : function () {}
				});
			},

			replaceContent : function () {
				var title = this.$nextPerson.find(".section-title").text();

				this.$person.find(".container").replaceWith(this.$nextPerson.find(".container"));
				this.$slideshow.nextAll().replaceWith(this.$nextPerson.find(".slideshow").nextAll());
				// this.$person.find(".bio").replaceWith(this.$nextPerson.find(".bio"));

				this.$title.text(title);

				this.setupDom(); // relink the dom vars
			},

			transitionContentOut : function () {
				this.$person.transition({
					opacity : 0,
					easing : "easeInOutQuad",
					duration : "500ms",
					complete : this.transitionContentIn
				});
			},

			transitionContentIn : function () {
				this.replaceContent();

				this.onResize(); // resize for new image

				this.$person.transition({ // transitionContentIn
					opacity : 1,
					easing : "easeInOutQuad",
					duration : "500ms"
				});
			},

		});
	}
);
