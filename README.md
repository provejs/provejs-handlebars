# provejs-handlebars

> Under active development.

Validating handlebars helpers syntax using handlebars AST tokens.

Consider you have the following helpers:
```hbs
{{helper1 foobar='goo'}}
{{helper2 'zoo'}}
```

The validation configuration would be:
```js
var config = {
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
};
```
