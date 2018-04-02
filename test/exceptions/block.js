'use strict';

var assert = require('assert');
var linter = require('../../index').linter;
var config = {helpers: {}};

describe('Block Problems', function () {

	it('block mismatched', function () {
		var html = '{{#foo}}{{/bar}}';
		var errors = linter(config, html);
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
	it.only('mismatched block helpers with newline', function () {

		var html = '{{#foo}}\n{{/bar}}';
		var errors = linter(config, html);

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
		var errors = linter(config, html);

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
