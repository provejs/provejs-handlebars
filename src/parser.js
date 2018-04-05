'use strict';

var Exceptions = require('./exceptions');
var Handlebars = require('handlebars');

exports.ast = function(html) {
	var ret;
	try {
		ret = Handlebars.parse(html);
	} catch (e) {
		ret = [Exceptions.parser(e, html)];
	}
	return ret;
};
