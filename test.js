'use strict';

var Handlebars = require('handlebars');
var Linter = require('./index').linter;

var config = {
	helpers: {
		nest: {
			params: [{
				name: 'template',
				hashed: true,
				formats: ['string', 'variable'],
				required: true
			}]
		}
	}
};
// var html = "{{field1}}{{helper1 foobar='goo'}}\n{{helper2 'zoo' 'goo'}}";
var html = "{{nest templatex=foobar}}";
var ast = Handlebars.parse(html);
var errors = Linter(config, ast);
console.log('errors:'.red, errors);