'use strict';

var assert = require('assert');
var hbs = require('handlebars');
var parser = require('../../src/exceptions').parser;

describe('Incomplete Expressions', function () {
	it('open empty expression', function () {
		var parsed;
		var html = '{{';
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
					column: 2
				},
				message: 'invalid Handlebars expression',
				severity: 'error'
			}, parsed);
		}
	});
	it('open and closed empty expression', function () {
		var parsed;
		var html = '{{}}';
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
					column: 2
				},
				message: 'empty Handlebars expression',
				severity: 'error'
			}, parsed);
		}
	});

	it('open block empty expression', function () {
		var parsed;
		var html = '{{#';
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
					column: 3
				},
				message: 'invalid Handlebars expression',
				severity: 'error'
			}, parsed);
		}
	});

	it('two open empty expression', function () {
		var parsed;
		var html = '{{{{';
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
					column: 4
				},
				message: 'invalid Handlebars expression',
				severity: 'error'
			}, parsed);
		}
	});
	it('open helper expression', function () {
		var parsed;
		var html = '{{foo';
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
					column: 2
				},
				message: 'invalid Handlebars expression',
				severity: 'error'
			}, parsed);
		}
	});

	it('open helper expression with dots prefix', function () {
		var parsed;
		var html = "<h1 class='foobar'>{{echo 'hello world'}</h1>\n<div>\n\tThis is an invalid div.";
		try {
			hbs.precompile(html);
		} catch (e) {
			//console.log(e);
			parsed = parser(e, html);
			assert.deepEqual({
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
			}, parsed);
		}
	});
	it('open helper expression with dots prefix', function () {
		var parsed;
		var html = "<h1 class='foobar'>{{foo {{echo 'hello world'}</h1>\n<div>\n\tThis is an invalid div.";
		try {
			hbs.precompile(html);
		} catch (e) {
			//console.log(e);
			parsed = parser(e, html);
			assert.deepEqual({
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
			}, parsed);
		}
	});
	it('open helper expression with dots prefix', function () {
		var parsed;
		var html = "<h1 class='foobar'>{{foo}}}} {{echo 'hello world'}</h1>\n<div>\n\tThis is an invalid div.";
		try {
			hbs.precompile(html);
		} catch (e) {
			//console.log(e);
			parsed = parser(e, html);
			assert.deepEqual({
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
			}, parsed);
		}
	});
});
