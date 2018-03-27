'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../index').linter;

describe('Linting', function () {
	it('empty html should not generate any errors', function () {
		var html = '';
		var config = {
			helpers: {
				helper1: {
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
	it('correct helper should not generate any errors', function () {
		var html = "{{helper1 template=foobar}}";
		var config = {
			helpers: {
				helper1: {
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
	it('missing helper named parameters', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
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
		// console.log('actual:', actual);
		Assert.notEqual(actual.length, 0);
	});
});
