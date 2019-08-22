'use strict';

var Helpers = require('./src/helpers');
var Parser = require('./src/parser');

function isErrors(ast) {
	return !!ast.length;
}

function mergeRules() {
	var res = {};
	for (var i = 0; i<arguments.length; i++) {
		for (var x in arguments[i]) {
			res[x] = arguments[i][x];
		}
	}
	return res;
}

exports.verifySync = function (html, rules) {

	var errors, ast, nodes;

	// extend rules for built-in hbs functions with
	// the user defined rules.
	rules = mergeRules(exports._configs, rules);

	ast = Parser.ast(html, rules);

	// parser may not be able to convert to ast.
	// if so return parser detected errors.
	if (isErrors(ast)) return ast;

	nodes = ast.body || ast;
	errors = Helpers.verify(nodes, rules);
	return errors;
};

exports.verify = function (html, next) {

	var issues = exports.verifySync(html);
	process.nextTick(next, null, issues);
};

exports.registerHelper = Helpers.register;

exports._configs = {
	helpers: Helpers.configs
};

