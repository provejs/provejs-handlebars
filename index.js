'use strict';

require('colors');
var _ = require('lodash');
var Selectors = require('./src/selectors');
var log = require('./src/utilities').log;
var Formats = require('./src/formats');
var Exceptions = require('./src/exceptions');
var Handlebars = require('handlebars');

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
	// log('pruneHelpers()');
	// log('node:'), node);
	// log('helper:'), helper);
	return helper;
}

function popMsg(str, helperName, hashName) {
	return str
		.replace('@helperName', helperName)
		.replace('@hashName', hashName);
}

function lintHelperCallback(astHelper, callback) {
	log('lintHelperCallback()');
	log('* astHelper:', astHelper);

	var posParams = Selectors.allPositional(astHelper);
	var namParams = Selectors.allNamed(astHelper);
	var loc = astHelper.loc;

	return callback(posParams, namParams, loc);
}

function lint(rule, param) {
	log('lint()');
	log('* rule:', rule);
	log('* param:', param);

	var ok = Formats.lint(rule, param);
	var message = rule.message || 'The `@helperName` helper positional parameter `@hashName` has an invalid value format.';
	var error;
	if (!ok) {
		message = popMsg(message, rule.helper, rule.name);
		error = {
			severity: rule.severity,
			message: message,
			start: param.loc.start,
			end: param.loc.end
		};
	}
	if (error) log('* error:', error);
	return error;
}

function lintHelperParam(astHelper, rule, ruleKey) {

	log('lintHelperParam()');
	log('* ruleKey:', ruleKey.yellow);

	var error;
	var selector = rule.selector;
	var params = Selectors.params(astHelper, selector, ruleKey);

	log('* params:', params);

	// lint each param against the config rule
	params.forEach(function(param) {
		if (error) return false; //break loop
		error = lint(rule, param);
	});

	// return early
	if (error) return error;
	if (rule.required === false) return;
	if (rule.required === 0) return;

	// lint missing params
	if (rule.required === true && params.length === 0) {
		return {
			severity: rule.severity,
			message: popMsg('The `@helperName` helper requires a positional parameter of `@hashName`, but non was found.', rule.helper, rule.name),
			start: astHelper.loc.start,
			end: astHelper.loc.end
		};
	} else if (rule.required > params.length) {
		return {
			severity: rule.severity,
			message: popMsg('The `@helperName` helper requires ' + rule.required + ' `@hashName` params, but only ' + params.length + 1 + ' were found.', rule.helper, rule.name),
			start: astHelper.loc.start,
			end: astHelper.loc.end
		};
	}
}

function lintHelper(astHelper, objRules) {
	var error;
	var params = objRules.params;

	log('lintHelper()');
	log('* astHelper:', astHelper);
	log('* objRules:', objRules);

	if (_.isFunction(params)) {
		error = lintHelperCallback(astHelper, params);
	} else if (_.isObject(params)) {
		_.forOwn(params, function(rule, ruleKey) {
			if (!rule.name) rule.name = ruleKey;
			if (!rule.helper) rule.helper = astHelper.name;
			if (!rule.severity) rule.severity = 'error';
			if (error) return false; // break loop
			error = lintHelperParam(astHelper, rule, ruleKey);
		});
	}

	return error;
}

function lintHelpers(helpers, rules) {
	log('lintHelpers()');
	var errors = [];
	helpers.forEach(function(helper) {
		var config = rules.helpers[helper.name];
		var err = lintHelper(helper, config);
		if (err) errors.push(err);
	});
	return errors;
}

function filterHelpersNodes(nodes, rules) {
	log('filterHelpersNodes()');
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
	log('* helpers:', helpers);
	return helpers;
}

function parse(html) {
	var ret;
	try {
		ret = Handlebars.parse(html);
	} catch (e) {
		ret = Exceptions.parser(e, html);
	}
	return ret;
}

exports.linter = function (rules, html) {

	log('linter()');

	var errors = [];
	var helpers;
	errors = parse(html);
	if (errors.length) return errors;
	var ast = errors;
	var nodes = ast.body || ast;
	helpers = filterHelpersNodes(nodes, rules);
	errors = lintHelpers(helpers, rules);

	return errors;
};
