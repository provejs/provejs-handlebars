'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../../index').linter;

function callback(posParms, namParams, loc) {
	if (posParms.length !== 7) {
		return {
			severity: 'error',
			message: 'Your custom linter error message here.',
			start: loc.start,
			end: loc.end
		};
	}
}

describe('Linting helper callback parameters', function () {
	it('callback success', function () {
		var html = "{{#ifCompound param1 '=' 42 'AND' param2 '!=' 42}}{{else}}{{/ifCompound}}";
		var config = {
			helpers: {
				ifCompound: {
					params: callback
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.deepEqual(actual.length, 0);
	});
	it('callback invalid', function () {
		var html = "{{#ifCompound param1 '=' 42 'AND' param2 '!='}}{{else}}{{/ifCompound}}";
		var config = {
			helpers: {
				ifCompound: {
					params: callback
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.deepEqual(actual.length, 1);
	});
});
