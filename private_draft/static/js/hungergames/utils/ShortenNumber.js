define(function () {
	return function (num) {
		num = ~~num;
		if (num > 10000000) {
			num = ~~(num / 1000000) + "m";
		} else if (num > 1000000) {
			num = ~~(num / 100000) / 10 + "m";
		} else if (num > 10000) {
			num = ~~(num / 1000) + "k";
		} else if (num > 1000) {
			num = ~~(num / 100) / 10 + "k";
		}
		return num;
	};
});
