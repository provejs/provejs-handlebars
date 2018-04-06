'use strict';

var Handlebars = require('handlebars');
var includes = require('lodash.includes');

function isHelper(node, knownHelpers) {
	if (Handlebars.AST.helpers.helperExpression(node)) return true;
	if (node.path && includes(knownHelpers, node.path.original)) return true;
	return false;
}

exports.helpers = function(tree, knownHelpers, helpers) {

	var nodes = tree.body || tree;

	// loop each parent nodes
	nodes.forEach(function(node) {
		// if helper push to helpers array
		if (isHelper(node, knownHelpers)) helpers.push(node);
		// if child nodes recursively call this method
		if (node.program) exports.helpers(node.program, knownHelpers, helpers);
	});
};
