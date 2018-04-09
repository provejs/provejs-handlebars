'use strict';

var Exceptions = require('./exceptions');
var Handlebars = require('handlebars');
var Blocks = require('./blocks');

exports.ast = function(html, rules) {
	var ret;
	var errParser;
	var errBlocks;
	try {
		ret = Handlebars.parse(html);
	} catch (e) {
		errParser = Exceptions.parser(e, html);
		errBlocks = Blocks.lint(html, rules);
		ret = (errBlocks.length)? errBlocks : [errParser];
	}
	return ret;
};
