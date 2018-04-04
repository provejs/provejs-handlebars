'use strict';

var Selectors = require('./selectors');
var Formats = require('./formats');
var Walker = require('./walker');
var isFunction = require('lodash.isfunction');
var isObject = require('lodash.isobject');
var forOwn = require('lodash.forown');
var keys = require('lodash.keys');


function pruneHelpers(node) {

	var name = node.path.original;
	var params = node.params;
	var hash = node.hash;

	var helper = {
		name: name,
		params: params,
		hash: hash,
		loc: node.loc,
		block: (node.type === 'BlockStatement')
	};
	return helper;
}

function popMsg(str, helperName, hashName) {
	return str
		.replace('@helperName', helperName)
		.replace('@hashName', hashName);
}

function lintHelperCallback(astHelper, callback) {
	var posParams = Selectors.allPositional(astHelper);
	var namParams = Selectors.allNamed(astHelper);
	var loc = astHelper.loc;

	return callback(posParams, namParams, loc);
}

function lint(rule, param) {


	var ok = Formats.lint(rule, param);
	var message = rule.message || 'The `@helperName` helper positional parameter `@hashName` has an invalid value format.';
	var error;
	if (!ok) {
		message = popMsg(message, rule.helper, rule.name);
		error = {
			severity: rule.severity,
			message: message,
			start: {
				line: param.loc.start.line - 1,
				column: param.loc.start.column
			},
			end: {
				line: param.loc.end.line - 1,
				column: param.loc.end.column
			}
		};
	}
	return error;
}

function lintHelperParam(astHelper, rule, ruleKey, block) {
	var error;
	var selector = rule.selector;
	var params = Selectors.params(astHelper, selector, ruleKey);

	// lint each param against the config rule
	params.forEach(function(param) {
		if (error) return false; //break loop
		error = lint(rule, param);
	});

	// return early
	if (error) return error;
	if (rule.required === false) return;
	if (rule.required === 0) return;

	// lint block and non-block helpers
	if (block !== astHelper.block) {
		var message = (block)
			? popMsg('The `@helperName` block helper requires a `#` before its name.', rule.helper)
			: popMsg('The `@helperName` non-block helper should not have a `#` before its name.', rule.helper);
		return {
			severity: 'error',
			message: message,
			start: {
				line: astHelper.loc.start.line - 1,
				column: astHelper.loc.start.column
			},
			end: {
				line: astHelper.loc.end.line - 1,
				column: astHelper.loc.end.column
			}
		};
	} else if (rule.required === true && params.length === 0) {  /// lint missing params

		return {
			severity: rule.severity,
			message: popMsg('The `@helperName` helper requires a positional parameter of `@hashName`, but non was found.', rule.helper, rule.name),
			start: {
				line: astHelper.loc.start.line - 1,
				column: astHelper.loc.start.column
			},
			end: {
				line: astHelper.loc.end.line - 1,
				column: astHelper.loc.end.column
			}
		};
	} else if (rule.required > params.length) {
		return {
			severity: rule.severity,
			message: popMsg('The `@helperName` helper requires ' + words(rule.required) + ' `@hashName` params, but only ' + params.length + ' were found.', rule.helper, rule.name),
			start: {
				line: astHelper.loc.start.line - 1,
				column: astHelper.loc.start.column
			},
			end: {
				line: astHelper.loc.end.line - 1,
				column: astHelper.loc.end.column
			}
		};
	}
}

function words(val) {
	if (val === false) return 'an optional';
	if (val === true) return 'one';
	if (val === 0) return 'an optional';
	if (val === 1) return 'one';
	if (val === 2) return 'two';
	if (val === 3) return 'three';
	return val;
}

function lintHelper(astHelper, objRules) {

	if (!objRules) return;

	var error;
	var params = objRules.params;
	var block = objRules.block || false;

	if (isFunction(params)) {
		error = lintHelperCallback(astHelper, params);
	} else if (isObject(params)) {
		forOwn(params, function(rule, ruleKey) {

			// set defaults
			if (!rule.name) rule.name = ruleKey;
			if (!rule.helper) rule.helper = astHelper.name;
			if (!rule.severity) rule.severity = 'error';

			if (error) return false; // break loop
			error = lintHelperParam(astHelper, rule, ruleKey, block);
		});
	}

	return error;
}

function lintHelpers(helpers, rules) {
	var errors = [];
	helpers.forEach(function(helper) {
		var config = rules.helpers && rules.helpers[helper.name];
		var err = lintHelper(helper, config);
		if (err) errors.push(err);
	});
	return errors;
}

exports.verify = function (nodes, rules) {
	var helpers = [];
	var names = keys(rules.helpers);
	Walker.helpers(nodes, names, helpers);
	helpers = helpers.map(pruneHelpers);
	var errors = lintHelpers(helpers, rules);
	return errors;
};

exports.register = function(name, config) {
	exports.configs[name] = config;
};


exports.configs = {
	if: {
		block: true,
		params: {
			value: {
				selector: 'positional(0)',
				required: 1
			},
			extraneous: {
				selector: '!',
				severity: 'warning',
				message: 'The {{#if}} helper only supports a single condition parameter. This parameter should be removed.',
				formats: false
			}
		}
	},
	lookup: {
		block: false,
		params: {
			haystack: {
				selector: 'positional(0)',
				required: 1
			},
			needle: {
				selector: 'positional(1)',
				required: 1
			},
			extraneous: {
				selector: '!',
				severity: 'warning',
				message: 'The {{#lookup}} helper only supports two parameters. This parameter should be removed.',
				formats: false
			}
		}
	},
	each: {
		block: true,
		params: {
			arrValue: {
				selector: 'positional(0)',
				required: 1
			},
			extraneous: {
				selector: '!',
				severity: 'warning',
				message: 'The {{#each}} helper only supports a single parameter and should be an array value. This parameter should be removed.',
				formats: false
			}
		}
	},
	unless: {
		block: true,
		params: {
			value: {
				selector: 'positional(0)',
				required: 1
			},
			extraneous: {
				selector: '!',
				severity: 'warning',
				message: 'The {{#unless}} helper only supports a single parameter. This parameter should be removed.',
				formats: false
			}
		}
	},
	with: {
		block: true,
		params: {
			value: {
				selector: 'positional(0)',
				required: 1
			},
			extraneous: {
				selector: '!',
				severity: 'warning',
				message: 'The {{#with}} helper only supports a single parameter. This parameter should be removed.',
				formats: false
			}
		}
	}
};
