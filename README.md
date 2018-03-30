# provejs-handlebars

> Under active development.

Validating Handlebars helpers syntax using handlebars AST tokens for purpose of inclusion in custom handlebars linters. However, you can use it to lint the built-in Handlebars helpers.

Helper parameters are either:
- **Named:** the helper is using named parameters.
- **Positional:** the helper is using ordered position of parameters.

# Install
```js
npm install provejs-handlebars --save
```

# Usage
You would invoke the module like:
```js
var html = '{{helper1 foobar='goo'}}\n{{helper2 'zoo' 'goo'}}';
var Handlebars = require('handlebars');
var Prove = require('provejs-handlebars');
var ast = Handlebars.parse(html);  // could throw an error
var errors = Prove(config, ast);
```
The error output will be something like:
```js
[ { severity: 'error',
    message: 'The `nest` helper requires a named parameter of `template`, but non was found.',
    start: { line: 1, column: 7 },
    end: { line: 1, column: 23 } } ]
```

# Configuration

Consider you have the following helpers with a single named param:
```hbs
{{myHelper param1=42}}
```
The validation configuration would be:
```js
var config = {
  helpers: {
    myHelper: {
      params: {
        param1: {
            formats: ['string', 'number', 'variable'],
            required: true
        }
      }
    }
  }
};
```

The params config can be:
- params (**object**|**function**): required config object or a function which directly validates the params.

When the params config is an object:

- name (**string**): optional name of parameter. Used in the linter error messages.
- selector (**string**| **number**|**function**): optional selector which specifies positional params. The selector borrows ideas from jQuery selector syntax. If selector is unspecified then a named param will be used.
- formats (**array**|**function**): optional param value types. If formats is undefined then any param is accepted. If it is a function you can validate the param value for fitness.
- required (**number**): required indicator of if the number of params that are required.
- message (**string**): custom linter message.

The param selector accepts the following:
- '*' : all parameters including both positional and named parameters
- '#paramName' : a named parameter
- 'eq(nth)': positional nth parameter
- 'gt(nth)': greater than nth parameter

When the params config is a function:

```js
params: function(positionalParams, namedParameters, helperLocation) {
  // Validate the array of parameters here. On errror or warning return something like below.
  // The start and end data for each param will be found in the positionalParms and namedParams nodes.
  // However you also have the overall helper location to use as well. 
  return {
    severity: 'error',
    message: '...',
    start: helperLocation.start,
    end: helperLocation.end
  }
}
```


## Example: one or more positional params
```hbs
{{#ifAny case1 case2 case3}}{{/ifAny}}
```
There needs to be one or more case positional parameter
```js
var config = {
  helpers: {
    ifAny: {
      params: {
        cases: {
            selector: 'eq(*)',
            required: 1
        }
      }]
    }
  }
};
```
## Example: one required, and one or more positional params
```hbs
{{#isAny var1 case1 case2 case3}}{{/isAny}}
```
```js
var params = {
    var1: {
        selector: 'eq(0)',
        required: 1
    },
    cases: {
        selector: 'gt(0)',
        required: 1
    }
};
var config = {
    helpers: {
        isAny: {
            params: params
        }
    }
};
```

## Example: one required named param
```hbs
{{nest template='subtemplate'}}
```
```js
var params: {
  template: {
    required: 1
  }
}
var config = {
    helpers: {
        isAny: {
            params: params
        }
    }
};
```

## Example: built-in handlebars helpers
```hbs
{{#if condition}}{{/if}}
{{lookup this 'foo'}}
{{#each arr}}{{/each}}
```
```js
var params1 = {
    condition: {required: 1}
};

var params2 = {
    value1: {required: 1},
    value2: {required: 1}
};
var params3 = {
    condition: {required: 1}
};
var config = {
    helpers: {
        if: {
            params: params1
        },
        lookup: {
            params: params2
        },
        each: {
            params: params3
        }
    }
};
```

# Example: Custom Parameters Helper

Consider you have helper that does compound logic:
```hbs
{{#ifCompound param1 '=' 42 'AND' param2 '!=' 42}}{{else}}{{/ifCompound}}
```
The validation configuration would be:
```js
var config = {
  helpers: {
    ifCompound: {
      params: function(positionalParams, namedParms, helperLocation) {
          // Validate the array of parameters here. On errror or warning return something like below.
          // The start and end data for each param will be found in the positionalParms and namedParams nodes.
          // However you also have the overall helper location to use as well. 
          return {
            severity: 'error',
            message: '...',
            start: helperLocation.start,
            end: helperLocation.end
          }
      }
    }
  }
};
```
