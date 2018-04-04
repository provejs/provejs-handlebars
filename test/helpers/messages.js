'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Testing blocks', function () {
	describe('Wrong syntax', function () {
		it('{{', function () {
			var html = '{{';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Empty or incomplete Handlebars expression.';
			Assert.equal(error.message, message);
		});
		it('{{#', function () {
			var html = '{{#';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Empty or incomplete Handlebars expression.';
			Assert.equal(error.message, message);
		});
		it('{{{', function () {
			var html = '{{';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Empty or incomplete Handlebars expression.';
			Assert.equal(error.message, message);
		});
		it('{{{#', function () {
			var html = '{{#';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Empty or incomplete Handlebars expression.';
			Assert.equal(error.message, message);
		});
		it('{{}', function () {
			var html = '{{}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Invalid or incomplete Handlebars expression.';
			Assert.equal(error.message, message);
		});
		it('{{#}', function () {
			var html = '{{#}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Invalid or incomplete Handlebars expression.';
			Assert.equal(error.message, message);
		});
		it('{{}}', function () {
			var html = '{{}}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Empty expression.';
			Assert.equal(error.message, message);
		});
		it('{{{}}}', function () {
			var html = '{{{}}}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = 'Empty expression.';
			Assert.equal(error.message, message);
		});

		it('{{#foo}}', function () {
			var html = '{{#foo}}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = "Missing closing expression for code near {{#foo}}.";
			Assert.equal(error.message, message);
		});
		it('<h1 class="foobar">{{#if \'hello world\'}}</h1>', function () {
			var html = '<h1 class="foobar">{{#if \'hello world\'}}</h1>';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = "Missing block closing expression for code near ...'hello world'}}</h1>.";
			Assert.equal(error.message, message);
		});



		it('{{#foo}}{{/bar}}', function () {
			var html = '{{#foo}}{{/bar}}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = "The opening and closing expressions do not match. Specifically, foo doesn't match bar.";
			Assert.equal(error.message, message);
		});
		it('{{foo}}{{/foo}}', function () {
			var html = '{{foo}}{{/foo}}';
			var errors = Linter.verify(html);
			var error = errors[0];
			var message = "Invalid closing block, check opening block.";
			Assert.equal(error.message, message);
		});
	});


	it('wrong block', function () {
		var html = '{{if a}}';
		var errors = Linter.verify(html);
		var error = errors[0];
		var message = "The {{#if}} block helper requires a `#` before its name.";
		Assert.equal(error.message, message);
	});
});
