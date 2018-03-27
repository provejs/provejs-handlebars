'use strict';

var Handlebars = require('handlebars');
var Linter = require('./index').linter;

var config = {
	helpers: {
		nest: {
			//allowExtraHashParams: false,
			hash: {
				template: {
					required: true,
					formats: ['StringLiteral', 'NumberLiteral', 'PathExpression']
				}
			}
		}
	}
};
// var html = "{{field1}}{{helper1 foobar='goo'}}\n{{helper2 'zoo' 'goo'}}";
var html = "{{nest template=foobar extra=value}}";
var ast = Handlebars.parse(html);
var errors = Linter(config, ast);
console.log('errors:'.red, errors);