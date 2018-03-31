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
          selector: 'named()',
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

- name (**string**): optional name of parameter. Used in the linter error messages. If name  is undefined we will use the config key.
- selector (**string**| **number**|**function**): required selector which specifies positional params. The selector borrows ideas from jQuery selector syntax. If selector is unspecified then a named param will be used.
  - **'*'**: all parameters including both positional and named parameters
  - **'named(*)'**: all named parameters
  - **'named()'**: a named parameter as identified by the param rule key
  - **'positional(*)'**: all positional parameters
  - **'positional(nth)'**: positional nth parameter
  - **'positionalGreaterThan(nth)'**: greater than nth parameter
  - **'!'**: any (both named and positional) params not already linted.
  - **'named(!)'**: any named params not already linted.
  - **'positional(!)'**: any positional params not already linted.
- formats (**array**|**function**|**boolean**): optional param value types. If formats is undefined then any param is accepted. If it is a function you can validate the param value for fitness. Array values include: ['string', 'number', 'variable', 'subexpression']. A bool value of false will always fail linting and a bool value of true will always pass linting. When a formats is a function the function arguments are: postionalParams, namedParams, helperLocation.
- required (**boolean**|**number**): required indicator of if the number of params that are required.
- message (**string**): custom linter message.
- severity (**string**): optional severity of the linting error. Either 'error' or 'warning'. Defaults to 'error'.

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
          selector: 'positional(*)',
          required: 1
        }
      }
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
    selector: 'positional(0)',
    required: 1
  },
  cases: {
    selector: 'positionalGreaterThan(0)',
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

};
var config = {
  helpers: {
    isAny: {
      params: {
        template: {
          selector: 'named()',
          required: 1
        }
      }
    }
  }
};
```

## Example: built-in handlebars helpers
```hbs
{{#if condition}}{{/if}}
{{lookup this 'foo'}}
{{#each arr}}{{/each}}
{{#unless foo}}{{/unless}}
```
```js
var config = {
  helpers: {
    if: {
      params: {
        value1: {
          selector: 'positional(0)',
          required: 1
        },
        extraneous: {
          selector: '!',
          severity: 'warning',
          message: 'The {{#if}} helper only supports a single condition parameter.',
          formats: false
        }
      }
    },
    lookup: {
      params: {
        value1: {
          selector: 'positional(0)',
          required: 1
        },
        value1: {
          selector: 'positional(1)',
          formats: ['string', 'variable'],
          required: 1
        },
        extraneous: {
          selector: '!',
          severity: 'warning',
          message: 'The {{#lookup}} helper only supports a two parameters.',
          formats: false
        }
      }
    },
    each: {
      params: {
        value1: {
          selector: 'positional(0)',
          required: 1
        },
        extraneous: {
          selector: '!',
          severity: 'warning',
          message: 'The {{#each}} helper only supports a single parameter and should be an array value.',
          formats: false
        }
      }
    },
    unless: {
      params: {
        value1: {
          selector: 'positional(0)',
          required: 1
        },
        extraneous: {
          selector: '!',
          severity: 'warning',
          message: 'The {{#unless}} helper only supports a single parameter.',
          formats: false
        }
      }
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
