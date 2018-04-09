'use strict';

var Parser = require('./parser');
var Collapse = require('./collapse');
var forOwn = require('lodash.forown');

function getNames(rules) {
	var names = [];
	forOwn(rules.helpers, function(helper, name) {
		if (helper && helper.block) names.push(name);
	});

	return names;
	// return ['if'];
}

exports.lint = function(html, rules) {
	var blocks = getNames(rules);
	var stack = Parser.stack(html, rules);
	stack = Collapse.stack(stack, blocks);
	return stack;
};
