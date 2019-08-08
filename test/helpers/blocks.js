'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Testing blocks', function () {
	it('if block as non-block', function () {
		var html = '{{if a}}';
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
	it('#if block', function () {
		var html = '{{#if a}}{{/if}}';
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 0);
	});

	it('helper as both block and inline', function () {
		var config = {
			helpers: {
				poly: {
					block: true,
					inline: true,
					params: {
						param1: {
							selector: 'named()',
							formats: ['string', 'variable'],
							required: true
						}
					}
				}
			}
		};
		var html = "{{poly param1='xxx'}}";
		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 0);
	});
	it('helper as both block and inline', function () {
		var config = {
			helpers: {
				poly: {
					block: true,
					inline: true,
					params: {
						param1: {
							selector: 'named()',
							formats: ['string', 'variable'],
							required: true
						}
					}
				}
			}
		};
		var html = "{{#poly param1='xxx'}}{{/poly}}";
		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 0);
	});
});
