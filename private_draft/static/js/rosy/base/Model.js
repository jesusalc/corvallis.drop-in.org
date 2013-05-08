define(

	[
		"../base/Class"
	],

	function (Class) {

		"use strict";

		return Class.extend({

			__data : null,
			defaults : null,

			init : function (input) {
				this.__data = {};
				this.defaults = this.defaults || {};
				this.reset(false, true);
				this.set(input, false);
			},

			set : function (key, val, trigger, skipSetters, recursive) {
				var i;

				if (typeof key === "string") {

					if (this.__data[key] !== val) {

						if (this['set_' + key] && !skipSetters) {
							this.__data[key] = val = this['set_' + key](val);
						}

						else {
							this.__data[key] = val;
						}
					}

					else {
						trigger = false;
					}

					if (trigger !== false) {
						this.trigger('change:' + key, key, val);

						if (!recursive) {
							if (trigger !== false) {
								this.trigger('changeany');
							}
						}
					}

					return val;
				}

				else {
					for (i in key) {
						this.set(i, key[i], val);
					}

					if (trigger !== false) {
						this.trigger('changeany');
					}
				}
			},

			get : function (key) {
				var i, output;

				if (key) {
					if (this['get_' + key]) {
						return this['get_' + key]();
					}
					return this.__data[key];
				}

				output = {};

				for (i in this.__data) {
					output[i] = this['get_' + i] ? this['get_' + i]() : this.__data[i];
				}

				return output;
			},

			reset : function (trigger, skipSetters) {
				var p;

				for (p in this.defaults) {
					this.set(p, this.defaults[p], trigger, skipSetters);
				}
			},

			keys : function () {
				var output = [],
					i;

				for (i in this.__data) {
					output.push(i);
				}

				return output;
			},

			validate : function () {

				var p,
					valid = true;

				for (p in this.__data) {

					if (this["validate_" + p]) {
						if (!this["validate_" + p](this.__data[p])) {
							valid = false;
						}
					}
				}

				return valid;
			}
		});
	}
);
