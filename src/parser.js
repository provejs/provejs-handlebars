'use strict';

var Exceptions = require('./exceptions');
var Handlebars = require('handlebars');

exports.ast = function(html) {
	var ret;
	var err;
	try {
		ret = Handlebars.parse(html);
	} catch (e) {
		err = Exceptions.parser(e, html);
		ret = [err];
	}
	return ret;
};
