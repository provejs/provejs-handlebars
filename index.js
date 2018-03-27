'use strict';

require('colors');
var _ = require('lodash');

// function printNode(node) {
// 	var name = node.path.original;
// 	var params = node.params;
// 	var hash = node.hash;
// 	// console.log('node:'.cyan, node);
// 	console.log();
// 	console.log('name:'.magenta, name);
// 	if (params.length) console.log('params:'.cyan, JSON.stringify(params));
// 	if (hash) console.log('hash:'.cyan, JSON.stringify(hash));
// };

// function printHelper(helper) {
// 	console.log();
// 	console.log('helper.name:'.magenta, helper.name);
// 	console.log('helpler.params:'.cyan, helper.params);
// };

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

	var helper = {
		name: name,
		params: params,
		hash: hash,
		loc: node.loc
	};
	// console.log('pruneHelpers()'.magenta);
	// console.log('node:'.gray, node);
	// console.log('helper:'.gray, helper);
	return helper;
}

function incorrectHashValueFormat(allowed2, actual2) {
	var actual = actual2
		.replace('PathExpression', 'variable')
		.replace('StringLiteral', 'string')
		.replace('NumberLiteral', 'number')
		.toLowerCase();

	var allowed = allowed2.map(function(str) {
		return str.toLowerCase();
	});

	// console.log('incorrectHashValueFormat()'.magenta);
	// console.log('* allowed:'.gray, allowed);
	// console.log('* actual:'.gray, actual);

	var ok =_.includes(allowed, actual);
	return !ok;
}

function popMsg(str, helperName, hashName) {
	return str
		.replace('@helperName', helperName)
		.replace('@hashName', hashName);
}

function validateHashRule(astHelper, rule, hash) {
	var missing = rule.required && !hash;
	var message;
	var error;

	console.log('validateHashRule()'.magenta);
	console.log('* rule:'.gray, rule);
	console.log('* hash:'.gray, hash);

	if (missing) {
		message = popMsg('The `@helperName` helper requires a named parameter of `@hashName`, but non was found.', astHelper.name, rule.name);
		error = {
			severity: 'error',
			message: message,
			start: astHelper.hash.loc.start,
			end: astHelper.hash.loc.end
		};
	} else if (incorrectHashValueFormat(rule.formats, hash.value.type)) {
		message = popMsg('The `@helperName` helper named parameter `@hashName` has an invalid value.', astHelper.name, rule.name);
		error = {
			severity: 'error',
			message: message,
			start: hash.loc.start,
			end: hash.loc.end
		};
	}
	console.log('* error:'.yellow, error);

	return error;
}

function validateHelper(astHelper, ruleHelper) {
	var error;

	console.log('validateHelper():'.magenta);
	console.log('* astHelper:'.gray, astHelper);
	console.log('* ruleHelper:'.gray, ruleHelper);

	// loop rule params
	ruleHelper.params.forEach(function(rule) {
		var hash = _.find(astHelper.hash.pairs, {key: rule.name});
		error = validateHashRule(astHelper, rule, hash);
	});
	return error;
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
