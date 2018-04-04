'use strict';

var includes = require('lodash.includes');
var isFunction = require('lodash.isfunction');
var isUndefined = require('lodash.isundefined');

function getValueType(param) {
	if (param.type === 'PathExpression') return 'variable';
	if (param.value) {
		if (param.value.type === 'SubExpression') return 'subexpression';
		if (param.value.type === 'PathExpression') return 'variable';
		if (param.value.type === 'StringLiteral') return 'string';
		if (param.value.type === 'NumberLiteral') return 'number';
	}
	return;
}

function getValue(param) {
	if (param.type === 'HashPair' && param.value) {
		if (param.value.type === 'StringLiteral') return param.value.value;
		if (param.value.type === 'NumberLiteral') return param.value.value;
	} else if (param.data && param.value) {
		if (param.value.type === 'StringLiteral') return param.value;
		if (param.value.type === 'NumberLiteral') return param.value;
	}
	return;
}

exports.lint = function(rule, param) {

	var formats = rule.formats;
	var type = getValueType(param);
	var value = getValue(param);
	var allowed, ok;

	// return early
	if (isUndefined(formats)) return true;
	if (formats === true) return true;
	if (formats === false) return false;

	if (Array.isArray(formats)) {
		allowed = formats.map(function(str) {
			return str.toLowerCase();
		});
		ok = includes(allowed, type, param);
		return ok;
	} else if (isFunction(formats)) {

		// todo: offset the loc lines to zero based.
		// can we do this for all loc objects?
		return formats(value, type, param);
	} else {
		return false;
	}
};
