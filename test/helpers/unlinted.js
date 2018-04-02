'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
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
		var ast = Handlebars.parse(html);
		var errors = Linter(config, ast);
		var error = errors[0];
		Assert.equal(errors.length, 1);
		Assert.equal(error.start.line, 1);
		Assert.equal(error.end.line, 1);
		Assert.equal(error.start.column, 20);
		Assert.equal(error.end.column, 28);
		Assert.equal(error.severity, 'warning');
	});
});