'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../../index').linter;

describe('Linting helper whitespace around parameters', function () {
	it('should ignore whitespace around helpers and params by default', function () {
		var html = '{{     helper1\nparam1=42}}';
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						type: 'named',
						formats: ['string', 'number', 'variable'],
						required: true
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
});
