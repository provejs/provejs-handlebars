'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../index').linter;

describe('Linting helper positional parameters', function () {
	it('empty html should not generate any errors', function () {
		var html = '';
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'template',
						hashed: false,
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
	it.only('correct helper should not generate any errors', function () {
		var html = "{{helper1 value1}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						hashed: false,
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
