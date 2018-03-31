'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../../index').linter;

describe('Linting helper params without checking param value formats', function () {
	it('checking param value formats is optional', function () {
		var html = '{{helper1 param1=42}}';
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
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
	it('checking param value formats=true', function () {
		var html = '{{helper1 param1=42}}';
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: true,
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
	it('checking param value formats=false', function () {
		var html = '{{helper1 param1=42}}';
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: false,
							required: true
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 1);
	});
	it('checking param value formats=function', function () {
		var html = '{{helper1 param1=42}}';
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: function(type, value, param) {
								console.log('type:', type);
								console.log('value:', value);
								console.log('param', param)
								return (param && value === 42 && type === 'number');
							},
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
