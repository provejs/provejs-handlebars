'use strict';

function word(val) {
	if (val === 0) return 'zero';
	if (val === 1) return 'one';
	if (val === 2) return 'two';
	if (val === 3) return 'three';
	return val;
}

function errorFormats(rule, params) {
	var message = (rule.block)
		? 'The {{#@helper.name}} helper parameter `@rule.name` has an invalid value format.'
		: 'The {{@helper.name}} helper parameter `@rule.name` has an invalid value format.';

	// allow override message via rule.message
	message = (rule.message)? rule.message : message;

	return exports.format(message, rule, params);
}

function errorBlock(rule) {
	var message = (rule.block)
		? exports.format('The {{#@helper.name}} block helper requires a `#` before its name.', rule)
		: exports.format('The {{@helper.name}} non-block helper should not have a `#` before its name.', rule);

	// allow override message via rule.message
	message = (rule.message)? rule.message : message;

	return message;
}

function errorParamMissing(rule, params) {
	var message;
	if (rule.required === true && params.length === 0) {
		message = exports.format('The {{@helper.name}} helper requires a `@rule.name` parameter, which was not found.', rule);
	} else if (rule.required === 1) {
		message = exports.format('The {{@helper.name}} helper requires ' + word(rule.required) + ' `@rule.name` parameter, which was not found.', rule);
	} else {
		message = exports.format('The {{@helper.name}} helper requires ' + word(rule.required) + ' `@rule.name` parameters, but ' + word(params.length) + ' were found.', rule);
	}

	// allow override message via rule.message
	message = (rule.message)? rule.message : message;

	return message;
}

function near(code) {
	return 'near `' + code.trim() + '`';
}

exports.parser = function (str, code) {

	// console.log(str);
	// console.log(code);

	if (str.indexOf("Expecting 'EQUALS', got") !== -1) {
		str = 'Invalid expression near ' + near(code) + '. Named parameters should only be placed after positional parameters.';
	} else if (str.indexOf("got 'INVALID'") !== -1) {
		str = 'Invalid or incomplete Handlebars expression ' + near(code) + '.';
	} else if (str === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'EOF'") {
		str = 'Empty or incomplete Handlebars expression ' + near(code) + '.';
	} else if (str === "Expecting 'EOF', got 'OPEN_ENDBLOCK'") {
		str = 'Invalid closing block, check open/close blocks ' + near(code) + '.';
	} else if (str === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE'") {
		str = 'Empty expression ' + near(code) + '.';
	} else if (str === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE_UNESCAPED'") {
		str = 'Empty expression ' + near(code) + '.';
	} else if (str === "Expecting 'CLOSE_RAW_BLOCK', 'CLOSE', 'CLOSE_UNESCAPED', 'OPEN_SEXPR', 'CLOSE_SEXPR', 'ID', 'OPEN_BLOCK_PARAMS', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', 'SEP', got 'OPEN'") {
		str = 'Invalid expression ' + near(code) + '.';
	} else if (str === "Expecting 'CLOSE', 'OPEN_SEXPR', 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE_RAW_BLOCK'") {
		str = 'Invalid expression ' + near(code) + '.';
	} else if (str.indexOf("Expecting 'OPEN_INVERSE_CHAIN', 'INVERSE', 'OPEN_ENDBLOCK', got 'EOF'") !== -1) {
		str = 'Missing block closing expression ' + near(code) + '.';
	} else if (str.indexOf("', got 'EOF'") !== -1) {
		str = 'Missing closing expression ' + near(code) + '.';
	} else if (str.indexOf("', got '") !== -1) {
		str = 'Invalid expression ' + near(code) + '.';
	} else if (str.indexOf("doesn't match") !== -1) {
		str = 'The opening and closing expressions do not match. Specifically, ' + mismatch(str) + '.';
	}

	// console.log(str);

	return str;
};

function mismatch(str) {
	return '{{' + str.replace(" doesn't match ", "}} doesn't match {{/") + '}}';
}

exports.get = function(type, rule, params) {
	if (type === 'block') return errorBlock(rule);
	if (type === 'formats') return errorFormats(rule, params);
	if (type === 'param-missing') return errorParamMissing(rule, params);
};

function paramNames(params) {
	params = params || [];
	var names = params.map(function(param) {
		if (param.key) {
			return param.key;
		} else if (param.original) {
			return param.original;
		} else if (param.path && param.path.original) {
			return param.path.original;
		}
		return param;
	});
	return names;
}

exports.format = function(message, rule, params) {

	var names = paramNames(params);
	names = '`' + names.join('`, `') + '`';

	// handle blocks
	if (rule.block) message = message.replace('{{@helper.name}}', '{{#@helper.name}}');

	return message
		.replace('@helper.name', rule.helper)
		.replace('@rule.name', rule.name)
		.replace('@param.names', names);
};
