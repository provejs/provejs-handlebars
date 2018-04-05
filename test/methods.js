'use strict';

var Assert = require('assert');
var Linter = require('../index');

describe('Methods', function () {
	it('Linter.verify()', function () {
		var html = '{{#if a}}{{else}}{{else}}{{/if}}';
		Linter.verify(html, function(err, issues) {
			if (err) throw err;
			Assert.equal(issues.length, 1);
		});
	});
});
