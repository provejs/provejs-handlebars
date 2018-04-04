'use strict';

var Assert = require('assert');
var Linter = require('../../index');

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
		var actual = Linter.verify(html, config);
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
		var actual = Linter.verify(html, config);
		Assert.deepEqual(actual.length, 1);
	});
});
