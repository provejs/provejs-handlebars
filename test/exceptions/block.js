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
				start: {
					line: 0,
					column: 2
				},
				end: {
					line: 0,
					column: 2
				},
				message: 'foo doesn\'t match bar',
				severity: 'error'
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
				start: {
					line: 0,
					column: 2
				},
				end: {
					line: 0,
					column: 2
				},
				message: 'foo doesn\'t match bar',
				severity: 'error'
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
				start: {
					line: 0,
					column: 0
				},
				end: {
					line: 0,
					column: 7
				},
				message: 'invalid closing block, check opening block',
				severity: 'error'
			}, parsed);
		}
	});
});
