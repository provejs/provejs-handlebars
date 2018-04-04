'use strict';

var find = require('lodash.find');

function getSelectorNum(selector) {
	return +selector
		.replace('positionalGreaterThan(', '')
		.replace('positional(', '')
		.replace('named(', '')
		.replace(')', '');
}

function notLinted(param) {
	return !param._linted;
}

function linted(param) {
	param._linted = true;
	return param;
}

exports.params = function(astHelper, selector, ruleKey) {

	var params = [];
	var param;
	var num;
	if (selector === '*') {
		params = exports.all(astHelper);
	} else if (selector === 'positional(*)') {
		params = exports.allPositional(astHelper);
	} else if (selector === 'named(*)') {
		params = exports.allNamed(astHelper);
	} else if (selector === 'named()') {
		param = exports.named(astHelper, ruleKey);
		if (param) params.push(param);
	} else if (selector === 'named(!)') {
		params = exports.allNamed(astHelper);
		params = params.filter(notLinted);
	} else if (selector.indexOf('named(') === 0) {
		num = getSelectorNum(selector);
		param = exports.namedNth(astHelper, num);
		if (param) params.push(param);
	} else if (selector.indexOf('positionalGreaterThan(') === 0) {
		num = getSelectorNum(selector);
		params = exports.positionalGreaterThan(astHelper, num);
	} else if (selector.indexOf('positional(') === 0) {
		num = getSelectorNum(selector);
		param = exports.positional(astHelper, num);
		if (param) params.push(param);
	} else if (selector === '!') {
		params = exports.all(astHelper);
		params = params.filter(notLinted);

	} else if (selector === 'positional(!)') {
		params = exports.allPositional(astHelper);
		params = params.filter(notLinted);
	}

	// mark each param as being selected for linting
	params = params.map(linted);

	return params;
};

exports.all = function(astHelper) {
	var arr1 = exports.allPositional(astHelper);
	var arr2 = exports.allNamed(astHelper);
	return [].concat(arr1, arr2);
};

exports.allNamed = function(astHelper) {
	var hash = astHelper.hash || {};
	var pairs = hash.pairs || [];
	return pairs;
};

exports.allPositional = function(astHelper) {
	return astHelper.params || [];
};

exports.named = function(astHelper, named) {
	var hash = astHelper.hash || {};
	var pairs = hash.pairs || [];
	var pair = find(pairs, {key: named});
	return pair;
};

exports.namedNth = function(astHelper, nth) {
	var hash = astHelper.hash || {};
	var pairs = hash.pairs || [];
	var pair = pairs[nth];
	return pair;
};

exports.positionalGreaterThan = function(astHelper, num) {
	var params = astHelper.params || [];
	return params.slice(num);
};

exports.positional = function(astHelper, num) {
	var params = astHelper.params || [];
	return params[num];
};
