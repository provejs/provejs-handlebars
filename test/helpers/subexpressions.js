'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting helper params with subexpressions', function () {
	it('should support subexpressions', function () {
		var html = "{{helper1 param1=(lookup . 'foobar')}}";
		Linter.registerHelper('helper1', {
			params: {
				param1: {
					selector: 'named()',
					formats: ['string', 'number', 'variable', 'subexpression'],
					required: true
				}
			}
		});
		var actual = Linter.verifySync(html);
		Assert.equal(actual.length, 0);
	});
});
