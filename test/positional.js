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
						type: 'positional',
						formats: ['string', 'variable'],
						position: 0,
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
		var html = "{{helper1 value1}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						type: 'positional',
						formats: ['string', 'variable'],
						position: 0,
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
	it('missing required helper positional parameter should generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						type: 'positional',
						formats: ['string', 'variable'],
						position: 0,
						required: true
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 1);
	});
	it('missing optional helper positional parameter should NOT generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						type: 'positional',
						formats: ['string', 'variable'],
						position: 0,
						required: false
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
	it('missing second optional helper positional parameter should NOT generate error', function () {
		var html = "{{helper1 value1}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						type: 'positional',
						formats: ['string', 'variable'],
						position: 0,
						required: true
					}, {
						name: 'param2',
						type: 'positional',
						formats: ['string', 'variable'],
						position: 1,
						required: false
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
	it('helper positional parameter with wrong value format should generate error', function () {
		var html = "{{helper1 42}}";
		var config = {
			helpers: {
				helper1: {
					params: [{
						name: 'param1',
						type: 'positional',
						formats: ['string'],
						position: 0,
						required: true
					}]
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 1);
	});
	it('extra helper positional parameter should generate warning');
});
