'use strict';

var Assert = require('assert');
var Linter = require('../../index').linter;

describe('Testing columns', function () {
	it('example one', function () {
		var html = '{{#if a a}}{{/if}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.column, 9);
		Assert.equal(error.end.column, 10);
	});
	it('example two', function () {
		var html = '{{#if a\na}}{{/if}}';
		var errors = Linter(html);
		var error = errors[0];
		Assert.equal(error.start.column, 1);
		Assert.equal(error.end.column, 2);
	});
});
