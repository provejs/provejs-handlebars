'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Block Problems', function () {

	it('broken html, no handlebars', function () {
		var html = '<h1 class="foobar">Hello World</h1>\n<div>\nThis is an invalid div.\n<div';
		var errors = Linter.verifySync(html);
		Assert.equal(0, errors.length);
	});
	it('block mismatched', function () {
		var html = '{{#foo}}{{/bar}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
	it('mismatched block helpers with newline', function () {
		var html = '{{#foo}}\n{{/bar}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
	it('mismatched block helpers', function () {
		var html = '{{foo}}{{/foo}}';
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
});
