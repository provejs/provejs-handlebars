'use strict';

var Selectors = require('./selectors');
var Formats = require('./formats');
var Walker = require('./walker');
var Messages = require('./messages');
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
		params: params || [],
		hash: hash || {
			pairs: []
		},
		loc: node.loc,
		block: (node.type === 'BlockStatement')
	};

	// zero-base location lines
	helper.loc.start.line = helper.loc.start.line - 1;
	helper.loc.end.line = helper.loc.end.line - 1;

	// zero-base named params location lines
	helper.params.forEach(function(param) {
		param.loc.start.line = param.loc.start.line - 1;
		param.loc.end.line = param.loc.end.line - 1;
	});

	// zero-base positional params location lines
	helper.hash.pairs.forEach(function(param) {
		param.loc.start.line = param.loc.start.line - 1;
		param.loc.end.line = param.loc.end.line - 1;
	});

	return helper;
}

function lintHelperCallback(astHelper, callback) {
	var posParams = Selectors.allPositional(astHelper);
	var namParams = Selectors.allNamed(astHelper);
	var loc = astHelper.loc;
	return callback(posParams, namParams, loc);
}

function lint(rule, param) {

	var ok = Formats.lint(rule, param);

	if (ok === false) {
		return {
			severity: rule.severity,
			message: Messages.get('formats', rule, [param]),
			start: {
				line: param.loc.start.line,
				column: param.loc.start.column
			},
			end: {
				line: param.loc.end.line,
				column: param.loc.end.column
			}
		};
	} else if (ok && ok.severity) {
		// custom callback can return an error object
		return ok;
	}
}

function hasMissingParams(rule, params) {
	if (rule.required === true && params.length === 0) return true;
	if (rule.required > params.length) return true;
	return false;
}

function hasWrongBlock(astHelper, rule) {
	return rule.block !== astHelper.block;
}

function lintHelperParam(astHelper, rule, ruleKey) {
	var error;
	var selector = rule.selector;
	var params = Selectors.params(astHelper, selector, ruleKey);
	var isMissingParams = hasMissingParams(rule, params);
	var isWrongBlock = hasWrongBlock(astHelper, rule);

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
	if (isWrongBlock) {
		return {
			severity: 'error',
			message: Messages.get('block', rule),
			start: {
				line: astHelper.loc.start.line,
				column: astHelper.loc.start.column
			},
			end: {
				line: astHelper.loc.end.line,
				column: astHelper.loc.end.column
			}
		};
	} else if (isMissingParams) {
		return {
			severity: rule.severity,
			message: Messages.get('param-missing', rule, params),
			start: {
				line: astHelper.loc.start.line,
				column: astHelper.loc.start.column
			},
			end: {
				line: astHelper.loc.end.line,
				column: astHelper.loc.end.column
			}
		};
	}
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
			rule.block = block;

			if (error) return false; // break loop
			error = lintHelperParam(astHelper, rule, ruleKey);
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
				message: 'The {{@helper.name}} block helper only supports a single parameter. The @param.names parameter(s) should be removed.',
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
				message: 'The {{@helper.name}} helper only supports two parameters. The @param.names parameter(s) should be removed.',
				formats: false
			}
		}
	},
	each: {
		block: true,
		params: {
			'array': {
				selector: 'positional(0)',
				required: 1
			},
			extraneous: {
				selector: '!',
				severity: 'warning',
				message: 'The {{@helper.name}} block helper only supports a single parameter and should be an array value. The @param.names parameter(s) should be removed.',
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
				message: 'The {{@helper.name}} block helper only supports a single parameter. The @param.names parameter(s) should be removed.',
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
				message: 'The {{@helper.name}} helper only supports a single parameter. The @param.names parameter(s) should be removed.',
				formats: false
			}
		}
	}
};
