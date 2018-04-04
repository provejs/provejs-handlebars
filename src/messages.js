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


// todo: merge this tow params related error messages into a single function Messages.get('param', rule, messages);
function errorParams1(rule) {
	var message = exports.format('The {{@helper.name}} helper requires a named parameter of `@rule.name`, but non was found.', rule);
	return message;
}

function errorParams2(rule, params) {
	var message = exports.format('The {{@helper.name}} helper requires ' + words(rule.required) + ' `@rule.name` params, but only ' + params.length + ' were found.', rule);
	return message;
}


exports.get = function(type, rule, params) {
	if (type === 'block') return errorBlock(rule);
	if (type === 'formats') return errorFormats(rule);
	if (type === 'params1') return errorParams1(rule);
	if (type === 'params2') return errorParams2(rule, params);
};

exports.format = function(message, rule) {

	// handle blocks
	if (rule.block) message = message.replace('{{@helper.name}}', '{{#@helper.name}}');

	return message
		.replace('@helper.name', rule.helper)
		.replace('@rule.name', rule.name);
};
