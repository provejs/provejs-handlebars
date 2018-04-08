'use strict';

var Assert = require('assert');
var Linter = require('../../index');

// https://github.com/wycats/handlebars.js/issues/1173

describe('Block Problems', function () {
	it('(regex 1) mismatched block helpers', function () {
		var html = '{{foo}}{{/foo}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
	it('(regex 2) block mismatched', function () {
		var html = '{{#foo}}{{/bar}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
	it('(regex 2) mismatched block helpers with newline', function () {
		var html = '{{#foo}}\n{{/bar}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});

	it('(regex 2) mismatched block helpers with newline', function () {
		var html = '{{#foo}}{{#bar}}{{/foo}}{{/bar}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
});
