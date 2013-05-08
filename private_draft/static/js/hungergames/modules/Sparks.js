define(
	[
		"rosy/modules/Module",
		"./grid/BlockCache",
		"$",
		"../data/User"
	],

	function (Module, BlockCache, $, User) {

		"use strict";

		var Sparks = Module.extend({
			sparks : {},

			init : function () {
				$(document).on('click', '.spark', this.toggleSpark);
				$(document).on('click', '.flag', this.toggleFlag);
				$(document).on('click', '.delete', this.promptDelete);
				BlockCache.on('addmany', this.addMany);
				BlockCache.on('add', this.addOne);
			},

			didGetFeatures : false,
			addMany : function (e, n, array) {
				var ids = [],
					id,
					i;
				if (!User.isLoggedIn() || !array.length) {
					return;
				}
				for (i = 0; i < array.length; i++) {
					id = array[i].get('primary_key');
					this.sparks[id] = true;
					ids.push(id);
				}
				ids = ids.join(',');
				if (!this.didGetFeatures) {
					ids += '&features';
					this.didGetFeatures = true;
				}
				$.ajax('/us/sparks?ids=' + ids, {
					dataType : 'json'
				}).done(this.proxy(function (data) {
					if (data.features) {
						this.syncFeatures(data.features);
					}
					this.sync(array, data.sparks, 'is_sparked');
				}));
				$.ajax('/us/flags?ids=' + ids, {
					dataType : 'json'
				}).done(this.proxy(function (data) {
					this.sync(array, data, 'is_flagged');
				}));
			},

			syncFeatures : function (ids) {
				var i;
				for (i = 0; i < ids.length; i++) {
					BlockCache.getBlockIfAvailable(ids[i], 'feature', this.sparkBlock);
				}
			},

			sparkBlock : function (block) {
				block.set('is_sparked', true);
			},

			sync : function (blocks, array, attr) {
				var i, j,
					spark,
					block;
				for (i = 0; i < array.length; i++) {
					for (j = 0; j < blocks.length; j++) {
						block = blocks[j];
						if (array[i] === block.get('primary_key')) {
							block.set(attr, true);
						}
					}
				}
			},

			addOne : function (e, n, block) {
				var id = block.get('primary_key');
				if (!this.sparks[id]) {
					this.addMany(null, null, [block]);
				}
			},

			toggleSpark : function (e) {
				var dom = $(e.currentTarget),
					id = dom.data('primary-key'),
					network = dom.data('network'),
					isSparked = dom.is('.active'),
					count = ~~dom.text() + (isSparked ? -1 : 1),
					isDetail = !!dom.data('is-detail'),
					action = isSparked ? 'unspark/' : 'spark/';

				if (id && network) {
					User.ifLoggedIn(this.proxy(function () {
						BlockCache.getBlock(id, network, this.proxy(function (block) {

							$.ajax(block.get('relative_url') + action, {
								type : "post"
							});

							block.set({
								total_sparks : count,
								is_sparked : !isSparked
							});

							this.publish("track.setCustomVar", {
								index : isSparked ? 4 : 3,
								name : isSparked ? "User Unsparked Something" : "User Sparked Something",
								value : "Yes",
								scope : 1
							});


							this.publish("track.event", {
								category : isSparked ? "Unspark" : "Spark",
								action : isDetail ? "Detail View" : "Grid View",
								label : block.get('relative_url')
							});

						}));
					}));
				}
			},

			toggleFlag : function (e) {
				var dom = $(e.currentTarget),
					id = dom.data('primary-key'),
					network = dom.data('network'),
					isFlagged = dom.is('.active'),
					action = isFlagged ? 'unflag' : 'flag';
				// console.log(id, network);
				if (id && network) {
					User.ifLoggedIn(this.proxy(function () {
						BlockCache.getBlock(id, network, this.proxy(function (block) {
							$.ajax(block.get('relative_url') + action, {
								type : "post"
							});
							// console.log('is_flagged', !isFlagged);
							block.set('is_flagged', !isFlagged);

							this.publish("track.event", {
								category : "UGC",
								action : isFlagged ? "Unflagged" : "Flagged",
								label : block.get('relative_url')
							});

						}));

					}));
				}
			},

			promptDelete : function (e) {

				e.preventDefault();
				var dom = $(e.currentTarget);

				this.publish("show_delete_prompt", {primaryKey : dom.data("primary-key")});
			}


		});

		return new Sparks();
	}
);
