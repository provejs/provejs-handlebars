'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting unlinted params', function () {
	it('Linting unlinted named params', function () {
		var html = "{{myHelper param1=1 extraa=2}}";
		Linter.registerHelper('myHelper', {
			params: {
				param1: {
					selector: 'named()',
					required: true
				},
				extraneous: {
					selector: 'named(!)',
					severity: 'warning',
					formats: false
				}
			}
		});
		var errors = Linter.verifySync(html);
		var error = errors[0];
		Assert.equal(errors.length, 1);
		Assert.equal(error.severity, 'warning');
	});
});
