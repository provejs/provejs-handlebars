'use strict';

var includes = require('lodash.includes');

function isHelper(node, names) {
	if (node.type !== 'MustacheStatement' && node.type !== 'BlockStatement') return false;
	if (node.params.length > 0) return true;
	if (node.hash !== undefined) return true;
	if (includes(names, node.path.original)) return true; // helper with no hash or params
	return false;
}

exports.helpers = function(tree, names, helpers) {

	var nodes = tree.body || tree;

	// loop each parent nodes
	nodes.forEach(function(node) {
		// if helper push to helpers array
		if (isHelper(node, names)) helpers.push(node);
		// if child nodes recursively call this method
		if (node.program) exports.helpers(node.program, names, helpers);
	});
};
