'use strict';


function words(val) {
	if (val === false) return 'an optional';
	if (val === true) return 'one';
	if (val === 0) return 'an optional';
	if (val === 1) return 'one';
	if (val === 2) return 'two';
	if (val === 3) return 'three';
	return val;
}

function errorFormats(rule) {
	var message = (rule.block)
		? 'The {{#@helper.name}} helper parameter `@rule.name` has an invalid value format.'
		: 'The {{@helper.name}} helper parameter `@rule.name` has an invalid value format.';
	return exports.format(message, rule);
}

function errorBlock(rule) {
	var message = (rule.block)
		? exports.format('The {{#@helper.name}} block helper requires a `#` before its name.', rule)
		: exports.format('The {{@helper.name}} non-block helper should not have a `#` before its name.', rule);
	return message;
}

function errorParams(rule, params) {
	var message = (rule.required === true)
		? exports.format('The {{@helper.name}} helper requires ' + words(rule.required) + ' `@rule.name` params, but only ' + params.length + ' were found.', rule)
		: exports.format('The {{@helper.name}} helper requires a `@rule.name` parameter, but non was found.', rule);
	return message;
}

exports.parser = function (str, code, message) {
	// console.log('parser()');
	// console.log('* str:', str);
	// console.log('* code:', code);

	if (str.indexOf("got 'INVALID'") !== -1)
		str = 'Invalid or incomplete Handlebars expression.';

	if (str === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'EOF'")
		str = 'Empty or incomplete Handlebars expression.';

	if (str === "Expecting 'EOF', got 'OPEN_ENDBLOCK'")
		str = 'Invalid closing block, check opening block.';

	if (str === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE'")
		str = 'Empty Handlebars expression.';

	if (str === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE_UNESCAPED'")
		str = 'Empty Handlebars expression.';

	if (str === "Expecting 'CLOSE_RAW_BLOCK', 'CLOSE', 'CLOSE_UNESCAPED', 'OPEN_SEXPR', 'CLOSE_SEXPR', 'ID', 'OPEN_BLOCK_PARAMS', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', 'SEP', got 'OPEN'")
		str = 'Invalid Handlebars expression.';

	if (str === "Expecting 'CLOSE', 'OPEN_SEXPR', 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE_RAW_BLOCK'")
		str = 'Invalid Handlebars expression.';

	if (str.indexOf("', got 'EOF'") !== -1)
		str = 'Missing closing Handlebars expression for ' + code + '.';

	if (str.indexOf("', got '") !== -1)
		str = 'Invalid Handlebars expression.';

	if (str.indexOf("doesn't match") !== -1)
		str = 'The opening and closing expressions do not match. Specifically, ' + str + '.';

	// console.log(str);

	return str;
};

exports.get = function(type, rule, params) {
	if (type === 'block') return errorBlock(rule);
	if (type === 'formats') return errorFormats(rule);
	if (type === 'params') return errorParams(rule, params);
};

exports.format = function(message, rule) {

	// handle blocks
	if (rule.block) message = message.replace('{{@helper.name}}', '{{#@helper.name}}');

	return message
		.replace('@helper.name', rule.helper)
		.replace('@rule.name', rule.name);
};
