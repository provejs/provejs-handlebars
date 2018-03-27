'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../index').linter;

describe('Linting', function () {
	it('empty AST', function () {
		// var html = "{{nest templatex=foobar}}";
		var html = "";
		var config = {
			helpers: {
				nest: {
					params: [{
						name: 'template',
						hashed: true,
						formats: ['string', 'variable'],
						required: true
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
});
