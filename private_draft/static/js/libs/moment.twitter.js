define(["moment"], function (moment) {
	moment.fn.twitter = function () {
		var diff = moment().diff(this, 'seconds');
		return diff < 60 ? diff + 's' :
			diff < 3600 ? ~~(diff / 60) + 'm' :
			diff < 86400 ? ~~(diff / 3600) + 'h' : this.format('D MMM');
	};
});
