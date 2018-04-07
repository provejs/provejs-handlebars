'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting helper subexpressions', function () {
	it('should support subexpressions in hash params (valid)', function () {
		var html = "{{helper1 param1=(lookup . 'foobar')}}";
		Linter.registerHelper('helper1', {
			params: {
				param1: {
					selector: 'named()',
					formats: ['string', 'number', 'variable', 'subexpression'],
					required: true
				}
			}
		});
		var actual = Linter.verifySync(html);
		Assert.equal(actual.length, 0);
	});
	it('should support subexpressions in hash params (invalid)', function () {
		var html = "{{helper1 param1=(lookup . 'foobar' aaa)}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
	it('should support subexpressions in positional params (valid)', function () {
		var html = "{{#each (lookup . 'foobar')}}{{/each}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 0);
	});
	it('should support subexpressions in positional params (invalid)', function () {
		var html = "{{#each (lookup . 'foobar' invalid)}}{{/each}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
	it('should support deep subexpressions in positional params (valid)', function () {
		var html = "{{#each (lookup . (lookup . 'foobar'))}}{{/each}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 0);
	});
	it('should support deep subexpressions in positional params (invalid)', function () {
		var html = "{{#each (lookup . (lookup . 'foobar' invalid))}}{{/each}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
	it('should support deep subexpressions in positional params (invalid)', function () {
		var html = "{{#if (lookup . 'foobar' invalid)}}{{/if}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
	it('should support deep subexpressions in positional params (invalid)', function () {
		var html = "{{#if a}}{{else if (lookup . 'foobar' invalid)}}{{/if}}";
		var errors = Linter.verifySync(html);
		Assert.equal(errors.length, 1);
	});
});
