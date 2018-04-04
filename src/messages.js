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
		: exports.format('The {{@helper.name}} helper requires a named parameter of `@rule.name`, but non was found.', rule);
	return message;
}

exports.parser = function (message) {
	if (message.indexOf("got 'INVALID'") !== -1) return 'Invalid Handlebars expression.';
	if (message === "Expecting 'EOF', got 'OPEN_ENDBLOCK'") return 'Invalid closing block, check opening block.';
	if (message === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE'") return 'Empty Handlebars expression.';
	if (message === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'EOF'") return 'Invalid Handlebars expression.';
	if (message === "Expecting 'CLOSE_RAW_BLOCK', 'CLOSE', 'CLOSE_UNESCAPED', 'OPEN_SEXPR', 'CLOSE_SEXPR', 'ID', 'OPEN_BLOCK_PARAMS', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', 'SEP', got 'OPEN'") return 'Invalid Handlebars expression.';
	if (message === "Expecting 'CLOSE', 'OPEN_SEXPR', 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE_RAW_BLOCK'") return 'Invalid Handlebars expression.';
	if (message.indexOf("', got '") !== -1) return 'Invalid Handlebars expression.';
	return message;
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
