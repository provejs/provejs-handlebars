'use strict';

var Assert = require('assert');
var Linter = require('../../index').linter;

describe('Linting unlinted params', function () {
	it('Linting unlinted named params', function () {
		var html = "{{myHelper param1=1 extraa=2}}";
		var config = {
			helpers: {
				myHelper: {
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
				}
			}
		};
		var errors = Linter(html, config);
		var error = errors[0];
		Assert.equal(errors.length, 1);
		Assert.equal(error.start.line, 0);
		Assert.equal(error.end.line, 0);
		Assert.equal(error.start.column, 21);
		Assert.equal(error.end.column, 29);
		Assert.equal(error.severity, 'warning');
	});
});
