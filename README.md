# provejs-handlebars

> Under active development.

Validating handlebars helpers syntax using handlebars AST tokens for purpose of inclusion in custom handlebars linters.

Consider you have the following helpers:
```hbs
{{helper1 foobar='goo'}}
{{helper2 'zoo' 'goo'}}
```
Helper params are either:
- named: the helper is using named parameters.
- positional: the helper is using ordered position of parameters.

The validation configuration would be:
```js
var config = {
  helpers: {
    helper1: {
      params: [{
        name: 'foobar',
        type: 'named',
        formats: ['string', 'number', 'variable'],
        required: true
      }]
    },
    helper2: {
       params: [{
        name: 'param1',
        type: 'postional',
        formats: ['string', 'number'],
        position: 0,
        required: true
      },
      {
        name: 'param2',
        postional: true,
        formats: ['number'],
        required: true
      }]
    }
  }
};
```
You would invoke the module like:
```js
var html = '{{helper1 foobar='goo'}}\n{{helper2 'zoo' 'goo'}}';
var Handlebars = require('handlebars');
var Prove = require('provejs-handlebars');
var ast = Handlebars.parse(html);
var errors = Prove(ast, config);
```

The error output will be something like:
```js
[ { severity: 'error',
    message: 'The `nest` helper requires a named parameter of `template`, but non was found.',
    start: { line: 1, column: 7 },
    end: { line: 1, column: 23 } } ]
```