# provejs-handlebars

> Under active development.

Validating handlebars helpers syntax using handlebars AST tokens for purpose of inclusion in handlebars linters.

Consider you have the following helpers:
```hbs
{{helper1 foobar='goo'}}
{{helper2 'zoo' 'goo'}}
```

OPTION 1: The validation configuration would be:
```js
var config = {
  helpers: {
    helper1: {
      hash: {
        foobar: {
          formats: ['string', 'number', 'variable'],
          value: function(value) {
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
      ]
    }
  }
};
```

OPTION 2: The validation configuration would be:
```js
var config = {
  helpers: {
    helper1: {
      params: [{
          name: 'foobar',
          hashed: true,
          formats: ['string', 'number', 'variable'],
          required: true
        }]
    },
    helper2: {
       params: [{
          name: 'param1',
          hashed: false,
          formats: ['string', 'number'],
          required: true
        },
        {
          name: 'param2',
          hashed: false,
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
