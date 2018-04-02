'use strict';

// var log = require('./src/utilities').log;
var Exceptions = require('./src/exceptions');
var Handlebars = require('handlebars');
var Helpers = require('./src/helpers');

function parse(html) {
	var ret;
	try {
		ret = Handlebars.parse(html);
	} catch (e) {
		ret = [Exceptions.parser(e, html)];
	}
	return ret;
}

function isErrors(ast) {
	return !!ast.length;
}

exports.linter = function (html, rules) {

	if (!rules) rules = exports.config;

	var errors;
	var ast = parse(html);

	if (isErrors(ast)) {
		errors = ast;
		return errors;
	}
	var nodes = ast.body || ast;
	errors = Helpers.linter(nodes, rules);
	return errors;
};

exports.config = {
	helpers: Helpers.config
};

