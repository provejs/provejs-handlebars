'use strict';
var log = require('./utilities').log;
var _ = require('lodash');

function getSelectorNum(selector) {
	return +selector
		.replace('gt(', '')
		.replace('eq(', '')
		.replace(')', '');
}

exports.params = function(astHelper, selector) {

	log('getParams():'.magenta);

	var params = [];
	var param;
	var named;
	var num;
	if (selector === '*') {
		params = exports.all(astHelper);
	} else if (selector === 'eq(*)') {
		params = exports.allPositional(astHelper);
	} else if (selector[0] === '#') {
		named = selector.replace('#', '');
		param = exports.named(astHelper, named);
		if (param) params.push(param);
	} else if (selector.index('gt(') === 0) {
		num = getSelectorNum(selector);
		params = exports.positionalGreaterThan(astHelper, num);
	} else if (selector.index('eq(') === 0) {
		num = getSelectorNum(selector);
		param = exports.positional(astHelper, num);
		if (param) params.push(param);
	}
	return params;
};


exports.all = function(astHelper) {
	log('all():'.magenta);
};

exports.allPositional = function(astHelper) {
	log('allPositional():'.magenta);
};

exports.named = function(astHelper, named) {
	var hash = astHelper.hash || {};
	var pairs = hash.pairs || [];
	var pair = _.find(pairs, {key: named});
	return pair;
};

exports.positionalGreaterThan = function(astHelper) {
	log('positionaGreatThan():'.magenta);
};

exports.positional = function(astHelper) {
	log('positional():'.magenta);
};
