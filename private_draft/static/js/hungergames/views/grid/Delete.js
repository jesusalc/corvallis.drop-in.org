define(
	[
		"../Modal",
		"$",
		"../../templates/delete-post",
		"../../data/User",
	],

	function (Modal, $, template, User) {

		"use strict";

		return Modal.extend({

			init : function () {
				this.subscribe("show_delete_prompt", this.createPrompt);
			},

			createPrompt : function (n) {
				this.pk = n.data.primaryKey;

				this.load();
			},

			loadComplete : function () {
				this.sup();

				var markup = template({});

				$(".modal").html(markup);



				this.sup();

				$(".modal .cancel").on("click", this.closeModal);
			},

			closeModal : function (e) {
				this.sup(e);
			},

			submit : function (e) {
				e.preventDefault();

				if (!this.working) {
					this.working = true;
					var params = {
						csrfmiddlewaretoken : $.cookie("csrfmiddlewaretoken"),
						primary_key : this.pk
					};
					// coming soon...
					/*
					$.ajax("/delete", {
						dataType : 'json',
						data : params
					}).done(this.submissionComplete).fail(this.dataError);
					*/
					// temp
					this.submissionComplete();
				}
			},

			submissionComplete: function () {
				this.working = false;
				this.publish("closeModal", {});

				// reload grid data or just pop it from the display?
			},

			submissionFail : function () {
				// there was an error trying to delete your post...
			}

		});
	}
);
