# provejs-handlebars

> Under active development.

Linting templates with Handlebars syntax. Supports:
- Configurable Handlebars helpers and params to support built-in and your helpers and their params.
  - **Named:** the helper is using named parameters.
  - **Positional:** the helper is using ordered position of parameters.
- Fields

Lints via:
- Handlebars exception message parsing,
- Handlebars AST tokens validation.

The purpose of this module is to make custom handlebars linters.


# Install
```js
npm install provejs-handlebars --save
```

# Usage

In Node.js:
```js
var Linter = require('provejs-handlebars').linter;
var html = '{{#foo}}{{/bar}}';
var errors = Linter(html);
```

The errors output will be something like:
```js
[ { severity: 'error',
    message: 'The `foo` helper has a mismatched closing block.',
    start: { line: 0, column: 0 },
    end: { line: 0, column: 23 } } ]
```

In browser:
```html
<script src="dist/handlebars-linter.js"></script>
<script>
var html = "{{helper param1=xxx}}";
var errors = ProveHandlebars.linter(html);
</script>
```

# Linter Signature

The linter function accepts two params:
- html (**html**): required html template string.
- config (**object**): optional config object which is defined below. If the config is undefined than a default config is used.

The default config lints the built-in handlebars helpers. The default config can be accessed:
```js
console.log(Linter.config); // node.js
console.log(ProveHandlebars.config); // browser
```

# Helpers Configuration

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
          message: 'The {{#lookup}} helper only supports two parameters.',
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

# Contributing

Linting:
```bash
grunt
```

Building for use in browser:
```bash
npm install browserify -g
browserify index.js -s ProveHandlebars> dist/provejs-handlebars.js
```

Test:
```bash
npm test
```