define(

	[
		"rosy/views/HistoryRouter"
	],

	function (HistoryRouter) {

		"use strict";

		return HistoryRouter.extend({

			stackIds : [],
			newStack : [],
			stack : [],

			shouldTransitionTo : function (View, config, params, data) {
				this._requirements(View, config, params, data);
				this._prune(View, config, params, data);
				this._build(View, config, params, data);

				this._logStack();
			},

			_requirements : function (View, config, params, data) {
				var bottomView = this._getViewFromStack(View);

				if (bottomView._isRosyClass) {
					bottomView = new View(config, params, data);
					bottomView.__init(config, params, data);
					this.transition(bottomView);
				} else if (bottomView._moduleID === View._moduleID) {
					bottomView.__update(params, data);
				}

				this.stackIds = [];
				this.newStack = [bottomView];

				while (View) {
					this.stackIds.unshift(View._moduleID);
					View = View.parentClass || (View.static && View.static.parentClass);
					if (View) {
						this.newStack.unshift(this._getViewFromStack(View));
					}
				}
			},

			_getViewFromStack : function (viewClass) {
				var i;
				for (i = 0; i < this.stack.length; i++) {
					if (this.stack[i]._moduleID === viewClass._moduleID) {
						return this.stack[i];
					}
				}
				return viewClass;
			},

			_contains : function (id) {
				var i;
				for (i = 0; i < this.stackIds.length; i++) {
					if (id === this.stackIds[i]) {
						return true;
					}
				}
				return false;
			},

			_prune : function (View, config, params, data) {
				var i,
					newStack = [],
					view;
				for (i = 0; i < this.stack.length;) {
					view = this.stack[i];
					if (!this._contains(view._moduleID)) {
						//console.log('dont need', view._moduleID);
						this.transition(null, view);
						this.stack.splice(i, 1);
					} else {
						i++;
					}
				}
			},

			_build : function (View, config, params, data) {
				var i,
					ChildView,
					ParentView,
					transition = [];
				for (i = 0; i < this.newStack.length; i++) {
					ChildView = this.newStack[i];
					if (ChildView._isRosyClass) {
						ChildView = this.newStack[i] = new ChildView();
						transition.unshift(ChildView);
					}
					if (ParentView) {
						ChildView.parent(ParentView);
					}
					ParentView = ChildView;
				}
				for (i = 0; i < transition.length; i++) {
					this.transition(transition[i]);
				}
				this.stack = this.newStack;
			},

			_logStack : function () {
				var stack = [],
					i;
				for (i = 0; i < this.stack.length; i++) {
					stack[i] = this.stack[i]._moduleID;
				}
				// window.console.log(' -- stack --');
				// window.console.log('    ', stack.join(' > '));
				// window.console.log(' -----------');
			}

		});
	}
);
