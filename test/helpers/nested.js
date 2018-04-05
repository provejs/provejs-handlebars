'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Nested block linting', function () {
	it('checking param value formats is optional', function () {
		var html = '{{#if a}}{{helper1 42}}{{/if}}';
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
		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 1);
	});
});
