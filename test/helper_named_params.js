'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../index').linter;

describe('Linting helper named parameters', function () {
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
	it('missing required helper named parameter should generate error', function () {
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
		Assert.notEqual(actual.length, 0);
	});
	it('missing optional helper named parameter should NOT generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'template',
						hashed: true,
						formats: ['string', 'variable'],
						required: false
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
});
