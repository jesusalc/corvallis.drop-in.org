define(['$'], function ($) {

	var LETTERS = "abcdefghijklmnopqrstuvwxyz".split(""),
		WORD = "",
		WORDS = 'thgil redaehon retoofon'.split(' ');

	$(document).on('keydown', function (e) {
		var code = e.keyCode,
			i;
		if (code < 65 && code > 90) {
			return;
		}
		WORD = (LETTERS[code - 65] + WORD).substr(0, 10);
		for (i = 0; i < WORDS.length; i++) {
			if (WORD.indexOf(WORDS[i]) === 0) {
				$('body').toggleClass((WORDS[i] + '_retsae').split("").reverse().join(""));
			}
		}
	});

	return;
});
