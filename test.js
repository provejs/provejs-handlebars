'use strict';

var Handlebars = require('handlebars');
var Linter = require('./index').linter;

var config = {
	helpers: {
		nest: {
			hash: {
				template: {
					required: true,
					formats: ['StringLiteral', 'NumberLiteral', 'PathExpression']
					//value: function (value) {return true;}
				}
			}
		}
	}
};
// var html = "{{field1}}{{helper1 foobar='goo'}}\n{{helper2 'zoo' 'goo'}}";
var html = "{{nest template=foobar}}";
var ast = Handlebars.parse(html);
Linter(config, ast);