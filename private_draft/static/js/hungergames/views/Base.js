define(

	[
		"rosy/views/View",
		"$"
	],

	function (View, $) {

		"use strict";

		return View.extend({

			dom : null,

			_parent : null,
			_child : null,
			parent : function (parent) {
				if (parent) {
					this._parent = parent;
					parent._child = this;
					this.didSetParent();
				} else {
					return this._parent;
				}
			},
			didSetParent : function () {

			},

			parentConfig : function () {
				return {};
			},

			parentParams : function () {
				return {};
			},

			load : function () {
				//console.log('[ ]', this._moduleID);
				this.dom = $("#main");
				this.loadComplete();
			},

			loadComplete : function () {
				this.sup();
			},

			transitionIn : function () {
				//console.log('[i]', this._moduleID);
				this.transitionInComplete();
			},

			transitionOut : function () {
				//console.log('[o]', this._moduleID);
				this.transitionOutComplete();
			},

			destroy : function () {
				//console.log('[x]', this._moduleID);

			}
		});
	}
);
