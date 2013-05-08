define(

	[
		"rosy/base/Class",
		"hungergames/Config",
		"$",
		"./BlockModel"
	],

	function (Class, Config, $, BlockModel) {

		"use strict";

		var BlockCache = Class.extend({

			blocks : {},
			init : function () {
				this.blocks = {};
			},

			getBlockIfAvailable : function (id, network, cb) {
				if (this.blocks[network + id]) {
					cb(this.blocks[network + id]);
				}
			},

			getBlock : function (id, network, cb) {
				var url;
				if (this.blocks[network + id]) {
					cb(this.blocks[network + id]);
					return;
				}
				url = ['', Config.get('REGION'), network, id, '?format=json'].join('/');
				$.ajax(url).done(this.proxy(function (data) {
					var block,
						object = data.object || data;
					object.primary_key = id;
					object.network = network;
					block = this.addOne(object);
					this.trigger('add', block);
					cb(block);
				})).fail(function () {
					// console.log(arguments);
					// throw new Error(arguments) ?
				});
			},

			addOne : function (data) {
				var model = new BlockModel(data),
					key = model.get('network') + model.get('primary_key');

				if (this.blocks[key]) {
					this.blocks[key].set(data);
				} else {
					this.blocks[key] = model;
				}
				return this.blocks[key];
			},

			addMany : function (array) {
				var op = [],
					i;
				for (i = 0; i < array.length; i++) {
					op.push(this.addOne(array[i]));
				}
				this.trigger('addmany', op);
				return op;
			},

			each : function (cb) {
				var i;
				for (i in this.blocks) {
					cb(this.blocks[i]);
				}
			}

		});

		return new BlockCache();
	}
);
