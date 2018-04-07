'use strict';

var Handlebars = require('handlebars');
var includes = require('lodash.includes');
var helperExpression = Handlebars.AST.helpers.helperExpression;

function isHelper(node, knownHelpers) {
	if (helperExpression(node)) return true;
	if (node.path && includes(knownHelpers, node.path.original)) return true;
	return false;
}

exports.helpers = function recursive(tree, knowHelpers, res) {
	var statements = tree.body || tree;
	var knowns = knowHelpers;

	statements.forEach(function (stmt) {
		if (!stmt) return;

		if (isHelper(stmt, knowns)) {
			res.push(stmt);
		}
		// subexpressions as param HashPair value
		if (stmt.value && helperExpression(stmt.value)) {
			res.push(stmt.value);
		}
		if (stmt.program && stmt.program.body) {
			recursive(stmt.program.body, knowns, res);
		}
		if (stmt.inverse && stmt.inverse.body) {
			recursive(stmt.inverse.body, knowns, res);
		}
		// support subexpressions in hash pairs
		if (stmt.hash && stmt.hash.pairs) {
			recursive(stmt.hash.pairs, knowns, res);
		}
		// support subexpressions in params
		if (stmt.params) {
			recursive(stmt.params, knowns, res);
		}
	});
	return res;
};
