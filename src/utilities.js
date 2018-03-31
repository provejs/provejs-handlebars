'use strict';
require('colors');

exports.log = function log(val1, val2) {
	var debug = false;
	if (!debug) return;
	if (val2) {
		console.log(val1.gray, val2);
	} else {
		console.log(val1.magenta);
	}
};
