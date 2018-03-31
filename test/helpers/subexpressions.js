'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../../index').linter;

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
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
});