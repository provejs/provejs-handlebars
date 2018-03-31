'use strict';

require('colors');
var _ = require('lodash');
var Selectors = require('./src/selectors');
var log = require('./src/utilities').log;

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
	// log('pruneHelpers()'.magenta);
	// log('node:'.gray, node);
	// log('helper:'.gray, helper);
	return helper;
}

function incorrectValueFormat(rule, param) {
	var formats = rule.formats;
	var actual = param.value.type;

	// if the formats are not specified then
	// accept param value format.
	if (!_.isArray(formats)) return false;

	actual = actual
		.replace('PathExpression', 'variable')
		.replace('StringLiteral', 'string')
		.replace('NumberLiteral', 'number')
		.toLowerCase();

	log('incorrectValueFormat()');
	log('* formats:', formats);
	log('* actual:', actual);

	var allowed = formats.map(function(str) {
		return str.toLowerCase();
	});

	var ok =_.includes(allowed, actual);
	return !ok;
}

function popMsg(str, helperName, hashName) {
	return str
		.replace('@helperName', helperName)
		.replace('@hashName', hashName);
}

// function validateRuleParamNamed(astHelper, rule) {

// 	var loc = (astHelper.hash)? astHelper.hash.loc : astHelper.loc;
// 	var hash = astHelper.hash || {};
// 	var pairs = hash.pairs || [];
// 	var pair = _.find(pairs, {key: rule.name});
// 	var missingRequired = rule.required && !pair;
// 	var missingOptional = !rule.required && !pair;
// 	var message;
// 	var error;

// 	log('validateRuleParamNamed()'.magenta);
// 	log('* rule:'.gray, rule);
// 	log('* pairs'.gray, pairs);
// 	log('* pair'.gray, pair);

// 	if (missingRequired) {
// 		message = popMsg('The `@helperName` helper requires a named parameter of `@hashName`, but non was found.', astHelper.name, rule.name);
// 		error = {
// 			severity: 'error',
// 			message: message,
// 			start: loc.start,
// 			end: loc.end
// 		};
// 	} else if (missingOptional) {
// 		// do nothing
// 	} else if (incorrectValueFormat(rule.formats, pair.value.type)) {
// 		message = popMsg('The `@helperName` helper named parameter `@hashName` has an invalid value format.', astHelper.name, rule.name);
// 		error = {
// 			severity: 'error',
// 			message: message,
// 			start: loc.start,
// 			end: loc.end
// 		};
// 	}
// 	log('* error:'.yellow, error);

// 	return error;
// }

// function validateRuleParamPositional(astHelper, rule) {

// 	var loc = astHelper.loc;
// 	var params = astHelper.params || [];
// 	var index = rule.position;
// 	var param = params[index];
// 	var missingRequired = rule.required && !param;
// 	var missingOptional = !rule.required && !param;
// 	var message;
// 	var error;

// 	log('validateRuleParamPositional()'.magenta);
// 	log('* rule:'.gray, rule);
// 	log('* param:'.gray, param);

// 	if (missingRequired) {
// 		message = popMsg('The `@helperName` helper requires a positional parameter of `@hashName`, but non was found.', astHelper.name, rule.name);
// 		error = {
// 			severity: 'error',
// 			message: message,
// 			start: loc.start,
// 			end: loc.end
// 		};
// 	} else if (missingOptional) {
// 		// do nothing
// 	} else if (incorrectValueFormat(rule.formats, param.type)) {
// 		message = popMsg('The `@helperName` helper positional parameter `@hashName` has an invalid value format.', astHelper.name, rule.name);
// 		error = {
// 			severity: 'error',
// 			message: message,
// 			start: param.loc.start,
// 			end: param.loc.end
// 		};
// 	}
// 	log('* error:'.yellow, error);

// 	return error;
// }

function validateHelperCallback(astHelper, callback) {
	log('validateHelperCallback():'.magenta);
	log('* astHelper:'.gray, astHelper);

	var positionalParams = astHelper.params;
	var namedParams = astHelper.hash && astHelper.hash.pairs;
	var loc = astHelper.loc;

	return callback(positionalParams, namedParams, loc);
}

function validate(rule, param) {
	log('validate()');
	log('* rule:', rule);
	log('* param:', param);

	var incorrect = incorrectValueFormat(rule, param);
	var message = rule.message || 'The `@helperName` helper positional parameter `@hashName` has an invalid value format.';
	var error;
	if (incorrect) {
		message = popMsg(message, rule.helper, rule.name);
		error = {
			severity: 'error',
			message: message,
			start: param.loc.start,
			end: param.loc.end
		};
	}
	if (error) log('* error:', error);
	return error;
}

function validateHelperParam(astHelper, rule) {

	log('validateHelperParam():');

	var error;
	var selector = rule.selector;
	var params = Selectors.params(astHelper, selector);

	log('* params:', params);

	// validate each param against the config rule
	params.forEach(function(param) {
		if (error) return false; //break loop
		error = validate(rule, param);
	});

	// return early
	if (error) return error;
	if (rule.required === false) return;
	if (rule.required === 0) return;

	// validate missing params
	if (rule.required === true && params.length === 0) {
		return {
			severity: 'error',
			message: popMsg('The `@helperName` helper requires a positional parameter of `@hashName`, but non was found.', rule.helper, rule.name),
			start: astHelper.loc.start,
			end: astHelper.loc.end
		};
	} else if (rule.required > params.length) {
		return {
			severity: 'error',
			message: popMsg('The `@helperName` helper requires ' + rule.required + ' `@hashName` params, but only ' + params.length + 1 + ' were found.', rule.helper, rule.name),
			start: astHelper.loc.start,
			end: astHelper.loc.end
		};
	}
}

function validateHelper(astHelper, ruleHelper) {
	var error;
	var params = ruleHelper.params;

	log('validateHelper():'.magenta);
	log('* astHelper:'.gray, astHelper);
	log('* ruleHelper:'.gray, ruleHelper);


	if (_.isObject(params)) {
		_.forOwn(params, function(rule, name) {
			if (!rule.name) rule.name = name;
			if (!rule.selector) rule.selector = '#' + name;
			if (!rule.helper) rule.helper = astHelper.name;
			if (error) return false; // break loop
			error = validateHelperParam(astHelper, rule);
		});
	} else if (_.isFunction(params)) {
		error = validateHelperCallback(astHelper, params);
	}

	return error;
}

function validateHelpers(helpers, rules) {
	log('validateHelpers()'.magenta);
	var errors = [];
	helpers.forEach(function(helper) {
		var config = rules.helpers[helper.name];
		var err = validateHelper(helper, config);
		if (err) errors.push(err);
	});
	return errors;
}

function filterHelpersNodes(nodes, rules) {
	log('filterHelpersNodes()'.magenta);
	var helperNames = _.keys(rules.helpers);

	var helpers = nodes.filter(function(node) {
		// log('node:', node);
		if (node.type !== 'MustacheStatement' && node.type !== 'BlockStatement') return false;
		if (node.params.length > 0) return true;
		if (node.hash !== undefined) return true;
		if (_.includes(helperNames, node.path.original)) return true; // helper with no hash or params
		return false;
	});

	helpers = helpers.map(pruneHelpers);
	log('* helpers:'.gray, helpers);
	return helpers;
}

exports.linter = function (rules, ast) {

	log('linter():'.magenta);
	log('* ast.body:'.gray, JSON.stringify(ast.body));
	var errors = [];
	var nodes = ast.body || ast;
	var helpers = filterHelpersNodes(nodes, rules);

	errors = _.concat(errors, validateHelpers(helpers, rules));

	return errors;
};
