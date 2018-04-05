'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Testing extra tags', function () {
	it('{{if a}}{{else}}{{/if}}{{/if}}', function () {
		var html = '{{#if a}}{{else}}{{else}}{{/if}}';
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
});
