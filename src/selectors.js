'use strict';
var log = require('./utilities').log;
var _ = require('lodash');

function getSelectorNum(selector) {
	return +selector
		.replace('positionalGreaterThan(', '')
		.replace('positional(', '')
		.replace('named(', '')
		.replace(')', '');
}

exports.params = function(astHelper, selector, ruleKey) {

	log('getParams()');

	var params = [];
	var param;
	var num;
	if (selector === '*') {
		params = exports.all(astHelper);
	} else if (selector === 'positional(*)') {
		params = exports.allPositional(astHelper);
	} else if (selector === 'named(*)') {
		params = exports.allNamed(astHelper);
	} else if (selector.indexOf('named(') === 0) {
		param = exports.named(astHelper, ruleKey);
		if (param) params.push(param);
	} else if (selector.indexOf('positionalGreaterThan(') === 0) {
		num = getSelectorNum(selector);
		params = exports.positionalGreaterThan(astHelper, num);
	} else if (selector.indexOf('positional(') === 0) {
		num = getSelectorNum(selector);
		param = exports.positional(astHelper, num);
		if (param) params.push(param);
	}
	return params;
};


exports.all = function(astHelper) {
	log('all()');
	var arr1 = exports.allPositional(astHelper);
	var arr2 = exports.allNamed(astHelper);
	return [].concat(arr1, arr2);
};

exports.allNamed = function(astHelper) {
	log('allNamed()');
	var hash = astHelper.hash || {};
	var pairs = hash.pairs || [];
	return pairs;
};

exports.allPositional = function(astHelper) {
	log('allPositional()');
	return astHelper.params || [];
};

exports.named = function(astHelper, named) {
	var hash = astHelper.hash || {};
	var pairs = hash.pairs || [];
	var pair = _.find(pairs, {key: named});
	return pair;
};

exports.positionalGreaterThan = function(astHelper, num) {
	log('positionaGreatThan()');
	var params = astHelper.params || [];
	return params.slice(num);
};

exports.positional = function(astHelper, num) {
	log('positional()');
	var params = astHelper.params || [];
	return params[num];
};