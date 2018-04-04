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

exports.verify = function (html, rules) {

	// todo: extend defaults
	if (!rules) rules = exports._configs;

	var errors;
	var ast = parse(html);

	if (isErrors(ast)) {
		errors = ast;
		return errors;
	}
	var nodes = ast.body || ast;
	errors = Helpers.verify(nodes, rules);
	return errors;
};

exports.register = function(name, config) {
	Helpers.configs[name] = config;
};

exports._configs = {
	helpers: Helpers.configs
};

