# provejs-handlebars

> Under active development.

Validating handlebars helpers syntax using handlebars AST tokens for purpose of inclusion in custom handlebars linters.

Helper parameters are either:
- named: the helper is using named parameters.
- positional: the helper is using ordered position of parameters.

# Usage
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

# Example: Named Parameters Helper

Consider you have the following helpers:
```hbs
{{myHelper param1=42}}
```
The validation configuration would be:
```js
var config = {
  helpers: {
    myHelper: {
      params: [{
        name: 'param1',
        type: 'named',
        formats: ['string', 'number', 'variable'],
        required: true
      }]
    }
  }
};
```

# Example: Positional Parameters Helper

Consider you have the following helpers:
```hbs
{{myHelper 42}}
```
The validation configuration would be:
```js
var config = {
  helpers: {
    myHelper: {
      params: [{
        name: 'param1',
        type: 'positional',
        formats: ['string', 'number', 'variable'],
        position: 0,
        required: true
      }]
    }
  }
};
```

# Example: Mixed Positional & Named Parameters Helper

Consider you have the following helpers:
```hbs
{{myHelper param1=42 43}}
```
The validation configuration would be:
```js
var config = {
  helpers: {
    myHelper: {
      params: [{
        name: 'param1',
        type: 'named',
        formats: ['string', 'number', 'variable'],
        required: true
      },{
        name: 'param2',
        type: 'positional',
        formats: ['string', 'number', 'variable'],
        position: 0,
        required: true
      }]
    }
  }
};
```

# Example: Custom Parameters Helper

Consider you have helper that does compound logic:
```hbs
{{#ifCompund param1 '=' 42 'AND' param2 '!=' 42}}{{else}}{{/ifCompound}}
```
The validation configuration would be:
```js
var config = {
  helpers: {
    ifCompound: {
      params: function(p1, p2, p3, p4, p5, p6, p7) {

      }
    }
  }
};
```