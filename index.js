'use strict';

require('colors');
var _ = require('lodash');

function printNode(node) {
	var name = node.path.original;
	var params = node.params;
	var hash = node.hash;
	// console.log('node:'.cyan, node);
	console.log();
	console.log('name:'.magenta, name);
	if (params.length) console.log('params:'.cyan, JSON.stringify(params));
	if (hash) console.log('hash:'.cyan, JSON.stringify(hash));
};

function printHelper(helper) {
	console.log();
	console.log('name:'.magenta, helper.name);
	if (helper.params.length) console.log('params:'.cyan, helper.params);
	if (helper.hash) console.log('hash:'.cyan, helper.hash);
};

function isHelper(node) {
	if (node.params.length > 0) return true;
	if (node.hash !== undefined) return true;
	return false;
}

function isStatement(node) {
	return node.type === 'MustacheStatement';
}

function pruneHelpers(node) {
	var name = node.path.original;
	var params = node.params;
	var hash = node.hash;
	return {
		name: name,
		params: params,
		hash: hash
	}
}

function incorrectHashValueFormat(allowed, actual) {
	console.log('incorrectHashValueFormat()');
	console.log('allowed:', allowed);
	console.log('actual:', actual);
	var ok =_.includes(allowed, actual);
	return !ok;
}

function validateHelper(helper, config) {
	printHelper(helper);
	console.log('config:'.magenta, JSON.stringify(config));
	var hash = helper.hash;
	var params = helper.params;

	console.log('validateHelper():'.magenta, helper.name);

	// loop config hash values
	_.forOwn(config.hash, function(rule, name) {

		var hash = _.find(helper.hash.pairs, {key: name});
		var error;

		console.log('validate hash:'.yellow, name);
		console.log('rule:'.yellow, rule);
		console.log('hash:'.yellow, config.hash);

		if (rule.required && !hash) {
			error = {

			};
		} else if (incorrectHashValueFormat(rule.formats, hash.value.type)) {
			error = {
				severity: 'error',
				message: 'Incorrect hash value format.',
				start: hash.loc.start,
				end: hash.loc.end
			};
		}
		console.log('error:'.yellow, error);
		return error;
	});

	return;
}

exports.linter = function (rules, ast) {
	var errors = [];
	var nodes = ast.body || ast;
	var statements = nodes.filter(isStatement);
	var helpers = statements.filter(isHelper);
	helpers = helpers.map(pruneHelpers);

	// loop helpers and validate
	helpers.forEach(function(helper) {
		var config = rules.helpers[helper.name];
		var err = validateHelper(helper, config);
		if (err) errors.push(err);
	});

	return errors;
};