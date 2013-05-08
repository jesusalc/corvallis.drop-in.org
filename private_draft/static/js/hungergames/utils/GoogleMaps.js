define([

		"rosy/base/Class",
		"$",
		"async!//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places"

	],
	function (Class, $) {

		"use strict";

		/*global google */

		return Class.extend({

			autocomplete : null,

			init : function () {
				var input = $('.city');

				if (!input.length) {
					return;
				}

				this.autocomplete = new google.maps.places.Autocomplete(input[0], {
					types: ['(cities)']
				});
				google.maps.event.addListener(this.autocomplete, 'place_changed', this.placeChanged);
			},

			placeChanged : function () {
				var place = this.autocomplete.getPlace(),
					object = this.getCityState(place);

				//console.log("placeChanged", place, object);

				$('input[name="location"]').val(object.city);
				$('input[name="country"]').val(object.country);
			},

			getCityState : function (place) {
				var i, component,
					length = place.address_components.length,
					city, country,
					output = {};

				for (i = 0; i < length; i++) {
					component = place.address_components[i];
					if (component.types[0] === "country") {
						output.country = component.short_name;
					}
					if (component.types[0] === "locality") {
						output.city = component.long_name;
					}
					if (component.types[0] === "administrative_area_level_3") {
						output.city = output.city || component.long_name;
					}
				}

				return output;
			}
		});
	}
);
