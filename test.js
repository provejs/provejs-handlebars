'use strict';

var Handlebars = require('handlebars');
var Linter = require('./index').linter;

var config = {
	helpers: {
		helper1: {
			hash: {
				foobar: {
					formats: ['string', 'number', 'variable'],
					value: function (value) {
						return true;
					}
				}
			}
		},
		helper2: {
			params: {
				0: {
					name: 'param1',
					formats: ['string', 'number']
				},
				1: {
					name: 'param2',
					formats: ['number']
				}
			}
		}
	}
};
var html = "{{field1}}{{helper1 foobar='goo'}}\n{{helper2 'zoo' 'goo'}}";
var ast = Handlebars.parse(html);
Linter(config, ast);