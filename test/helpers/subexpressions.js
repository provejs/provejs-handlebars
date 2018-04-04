'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting helper params with subexpressions', function () {
	it('should support subexpressions', function () {
		var html = "{{helper1 param1=(lookup . 'foobar')}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: ['string', 'number', 'variable', 'subexpression'],
							required: true
						}
					}
				}
			}
		};
		var actual = Linter.verify(html, config);
		Assert.equal(actual.length, 0);
	});
});
