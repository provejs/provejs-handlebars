'use strict';

var Helpers = require('./src/helpers');
var Parser = require('./src/parser');

function isErrors(ast) {
	return !!ast.length;
}

exports.verifySync = function (html, rules) {

	// todo: extend defaults
	// Handlebars.Utils.extend(exports._config, rules);
	if (!rules) rules = exports._configs;

	var errors;
	var ast = Parser.ast(html, rules);

	// parser may not be able to convert to ast.
	// if so return parser detected errors.
	if (isErrors(ast)) return ast;

	var nodes = ast.body || ast;
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

