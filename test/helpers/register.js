'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Methods', function () {

	var config = {
		block: false,
		params: {
			param1: {
				selector: 'named()',
				required: true
			}
		}
	};

	it('register linter config', function () {
		var html = '{{foo}}';
		Linter.registerHelper('foo', config);
		var errors = Linter.verifySync(html);
		Assert.equal(1, errors.length);
	});
	it('unregister linter config', function () {
		var html = '{{foo}}';
		Linter.registerHelper('foo');
		var errors = Linter.verifySync(html);
		Assert.equal(0, errors.length);
	});
	it('register linter config again', function () {
		var html = '{{foo}}';
		var errors = Linter.verifySync(html, config);
		Assert.equal(0, errors.length);
	});
});
