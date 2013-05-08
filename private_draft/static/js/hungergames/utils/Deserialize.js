define([], function () {
	return function (p) {
		var ret = {},
			seg = p.replace(/^\?/, '').split('&'),
			len = seg.length,
			i,
			s;
		for (i = 0; i < len; i++) {
			if (!seg[i]) {
				continue;
			}
			s = seg[i].split('=');
			ret[s[0]] = s[1];
		}
		return ret;
	};
});

