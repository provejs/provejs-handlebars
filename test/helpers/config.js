'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting helper params bogus configs', function () {
	it('no config and with helper', function () {
		var html = '{{helper1 param1=42}}';
		var actual = Linter.verify(html);
		Assert.equal(actual.length, 0);
	});
	it('empty config', function () {
		var html = '{{helper1 param1=42}}';
		var actual = Linter.verify(html, {});
		Assert.equal(actual.length, 0);
	});
	it('misconfig helpers array', function () {
		var html = '{{helper1 param1=42}}';

		var actual = Linter.verify(html, {helpers: []});
		Assert.equal(actual.length, 0);
	});
	it('misconfig helpers helper array', function () {
		var html = '{{helper1 param1=42}}';
		var config = {
			helpers: {
				helper1: []
			}
		};
		var actual = Linter.verify(html, config);
		Assert.equal(actual.length, 0);
	});
	it('misconfig helpers helper object', function () {
		var html = '{{helper1 param1=42}}';
		var config = {
			helpers: {
				helper1: {}
			}
		};
		var actual = Linter.verify(html, config);
		Assert.equal(actual.length, 0);
	});
});
