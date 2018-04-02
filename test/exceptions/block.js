'use strict';

var assert = require('assert');
var hbs = require('handlebars');
var parser = require('../../src/exceptions').parser;

describe('Block Problems', function () {

	it('block mismatched', function () {
		var parsed;
		var html = '{{#foo}}{{/bar}}';
		try {
			hbs.precompile(html);
		} catch (e) {
			//console.log(e);
			parsed = parser(e, html);
			assert.deepEqual({
				minLine: 0,
				minColumn: 2,
				maxLine: 0,
				maxColumn: 3,
				message: 'foo doesn\'t match bar'
			}, parsed);
		}
	});
	it('mismatched block helpers with newline', function () {
		var parsed;
		var html = '{{#foo}}\n{{/bar}}';
		try {
			hbs.precompile(html);
		} catch (e) {
			//console.log(e);
			parsed = parser(e, html);
			assert.deepEqual({
				minLine: 0,
				minColumn: 2,
				maxLine: 0,
				maxColumn: 3,
				message: 'foo doesn\'t match bar'
			}, parsed);
		}
	});
	it('mismatched block helpers', function () {
		var parsed;
		var html = '{{foo}}{{/foo}}';
		try {
			hbs.precompile(html);
		} catch (e) {
			//console.log(e);
			parsed = parser(e, html);
			assert.deepEqual({
				minLine: 0,
				minColumn: 0,
				maxLine: 0,
				maxColumn: 7,
				message: 'invalid closing block, check opening block'
			}, parsed);
		}
	});
});