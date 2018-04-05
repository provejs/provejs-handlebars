'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting helper whitespace around parameters', function () {
	it('should ignore whitespace around helpers and params by default', function () {
		var html = '{{     helper1\nparam1=42}}';
		Linter.registerHelper('helper1', {
			params: {
				param1: {
					selector: 'named()',
					required: true
				}
			}
		});
		var actual = Linter.verifySync(html);
		Assert.equal(actual.length, 0);
	});
});
