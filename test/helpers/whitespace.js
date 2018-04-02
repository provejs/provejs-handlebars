'use strict';

var Assert = require('assert');
var Linter = require('../../index').linter;

describe('Linting helper whitespace around parameters', function () {
	it('should ignore whitespace around helpers and params by default', function () {
		var html = '{{     helper1\nparam1=42}}';
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
		var actual = Linter(html, config);
		Assert.equal(actual.length, 0);
	});
});
