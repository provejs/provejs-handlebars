'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Testing blocks', function () {
	it('if block', function () {
		var html = '{{if a}}';
		var errors = Linter.verify(html);
		Assert.equal(errors.length, 1);
	});
	it('#if block', function () {
		var html = '{{#if a}}{{/if}}';
		var errors = Linter.verify(html);
		Assert.equal(errors.length, 0);
	});
});
