'use strict';

var Assert = require('assert');
var Linter = require('../../index').linter;

describe('Testing locations', function () {
	it('extra param on block helper use param location', function () {
		var html = '{{#if a\na}}{{/if}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 1);
	});
	it('extra param on non-block helper use param location', function () {
		var html = '{{lookup a b \nc}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 1);
	});
	it('block/non-block helper use helper location', function () {
		var html = '{{if a}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 8);
	});
	it('block/non-block helper use helper location', function () {
		var html = '{{#lookup a b}}{{/lookup}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 26);
	});

	it('open expression use helper open braces', function () {
		var html = '{{';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 2);
	});
	it('empty expression use helper open braces', function () {
		var html = '{{}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 2);
	});
	it('empty block expression use helper open braces', function () {
		var html = '{{#}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 3);
	});

	it('helper param missing use helper location', function () {
		var html = '{{lookup}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 10);
	});

	it.skip('empty handlebars expression', function () {
		var html = '<h1>   \n{{}}</h1>';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 4);
	});

	it('block mismatched', function () {
		var html = '{{#foo}}{{/bar}}';
		var errors = Linter(html);
		Assert.deepEqual({
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
		var errors = Linter(html);

		Assert.deepEqual({
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
		var errors = Linter(html);

		Assert.deepEqual({
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

