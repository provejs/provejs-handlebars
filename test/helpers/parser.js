'use strict';

// var Assert = require('assert');
var Linter = require('../../index');
var Parser = require('../../src/parser2');

describe('Testing different block parser', function () {
	it.skip('extra closing block', function () {
		var html = '{{#if b}}{{#if b}}{{/if}}{{/if}}{{/if}}';
		Parser.lint(html, Linter._configs);

		// var message = "Extra closing expression near `{{/if}}`. There are 2 extra `{{/if}}` closing blocks in this entire template.";
		// Assert.equal(error.message, message);
		// Assert.equal(error.type, 'EXCEPTION1');
	});
});
