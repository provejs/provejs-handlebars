'use strict';

var log = require('./utilities').log;
var isArray = require('lodash.isarray');
var includes = require('lodash.includes');
var isFunction = require('lodash.isfunction');
var isUndefined = require('lodash.isundefined');

function getValueType(param) {
	if (param.type === 'PathExpression') return 'variable';
	if (param.value.type === 'SubExpression') return 'subexpression';
	if (param.value.type === 'PathExpression') return 'variable';
	if (param.value.type === 'StringLiteral') return 'string';
	if (param.value.type === 'NumberLiteral') return 'number';
	return;
}

function getValue(param) {
	log('getValue()');
	log('* param:', param);
	if (param.type === 'HashPair') {
		if (param.value.type === 'StringLiteral') return param.value.value;
		if (param.value.type === 'NumberLiteral') return param.value.value;
	} else if (param.data) {
		if (param.value.type === 'StringLiteral') return param.value;
		if (param.value.type === 'NumberLiteral') return param.value;
	}
	return;
}

exports.lint = function(rule, param) {

	log('incorrectValueFormat()');

	var formats = rule.formats;
	var type = getValueType(param);
	var value = getValue(param);
	var allowed, ok;

	log('* formats:', formats);
	log('* type:', type);
	log('* value:', value);

	// return early
	if (isUndefined(formats)) return true;
	if (formats === true) return true;
	if (formats === false) return false;

	if (isArray(formats)) {
		allowed = formats.map(function(str) {
			return str.toLowerCase();
		});
		ok = includes(allowed, type, param);
		return ok;
	} else if (isFunction(formats)) {
		return formats(type, value, param);
	} else {
		return false;
	}
};
