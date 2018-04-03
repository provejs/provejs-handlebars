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
	it('`{{}}` empty expression use helper braces', function () {
		var html = '{{}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 4);
	});
	it('empty block expression use helper braces', function () {
		var html = '{{#}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 5);
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
	it('empty handlebars expression', function () {
		var html = '<h1>   \n{{#}}</h1>';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 5);
	});
	it('empty handlebars expression', function () {
		var html = '<h1>                             \n{{#}}</h1>';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 5);
	});
	it('empty handlebars expression', function () {
		var html = '<h1>                             \n{{</h1>';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.column, 3);
	});

	it('block mismatched', function () {
		var html = '{{#foo}}{{/bar}}';
		var errors = Linter(html);
		var error = errors[0];
		// todo: this seems wrong?
		Assert.equal(error.start.line, 0);
		Assert.equal(error.start.column, 2);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.end.column, 2);
	});
	it('mismatched block helpers with newline', function () {

		var html = '{{#foo}}\n{{/bar}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.start.column, 2);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.end.column, 2);
	});
	it('mismatched block helpers', function () {
		var html = '{{foo}}{{/foo}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.end.column, 7);
	});


	// incomplete expressions
	it('open empty expression', function () {
		var html = '{{';
		var errors = Linter(html);
		var error = errors[0];

		Assert.equal(error.start.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.end.column, 2);

	});
	it('open and closed empty expression', function () {
		var html = '{{}}';
		var errors = Linter(html);
		Assert.deepEqual({
			start: {
				line: 0,
				column: 0
			},
			end: {
				line: 0,
				column: 4
			},
			message: 'empty Handlebars expression',
			severity: 'error'
		}, errors[0]);

	});

	it('open block empty expression', function () {

		var html = '{{#';
		var errors = Linter(html);
		Assert.deepEqual({
			start: {
				line: 0,
				column: 0
			},
			end: {
				line: 0,
				column: 3
			},
			message: 'invalid Handlebars expression',
			severity: 'error'
		}, errors[0]);

	});

	it('two open empty expression', function () {
		var html = '{{{{';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.line, 0);
		Assert.equal(error.start.column, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.end.column, 4);
	});
	it('open helper expression', function () {

		var html = '{{foo';
		var errors = Linter(html);
		Assert.deepEqual({
			start: {
				line: 0,
				column: 0
			},
			end: {
				line: 0,
				column: 2
			},
			message: 'invalid Handlebars expression',
			severity: 'error'
		}, errors[0]);

	});

	it('open helper expression with dots prefix', function () {

		var html = "<h1 class='foobar'>{{echo 'hello world'}</h1>\n<div>\n\tThis is an invalid div.";
		var errors = Linter(html);
		Assert.deepEqual({
			start: {
				line: 0,
				column: 19
			},
			end: {
				line: 0,
				column: 39
			},
			message: 'invalid Handlebars expression',
			severity: 'error'
		}, errors[0]);

	});
	it('open helper expression with dots prefix', function () {

		var html = "<h1 class='foobar'>{{foo {{echo 'hello world'}</h1>\n<div>\n\tThis is an invalid div.";
		var errors = Linter(html);
		Assert.deepEqual({
			start: {
				line: 0,
				column: 19
			},
			end: {
				line: 0,
				column: 39
			},
			message: 'invalid Handlebars expression',
			severity: 'error'
		}, errors[0]);

	});
	it('open helper expression with dots prefix', function () {

		var html = "<h1 class='foobar'>{{foo}}}} {{echo 'hello world'}</h1>\n<div>\n\tThis is an invalid div.";
		var errors = Linter(html);
		Assert.deepEqual({
			start: {
				line: 0,
				column: 19
			},
			end: {
				line: 0,
				column: 39
			},
			message: 'invalid Handlebars expression',
			severity: 'error'
		}, errors[0]);

	});

});

