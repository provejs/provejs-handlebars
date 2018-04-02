'use strict';

var assert = require('assert');
var linter = require('../../index').linter;

describe('Block Problems', function () {

	it('broken html, no handlebars', function () {
		var html = '<h1 class="foobar">Hello World</h1>\n<div>\nThis is an invalid div.\n<div';
		var errors = linter(html);
		assert.equal(0, errors.length);
	});

	it('block mismatched', function () {
		var html = '{{#foo}}{{/bar}}';
		var errors = linter(html);
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
		}, errors[0]);
	});
	it('mismatched block helpers with newline', function () {

		var html = '{{#foo}}\n{{/bar}}';
		var errors = linter(html);

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
		}, errors[0]);
	});
	it('mismatched block helpers', function () {
		var html = '{{foo}}{{/foo}}';
		var errors = linter(html);

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
		}, errors[0]);

	});
});
