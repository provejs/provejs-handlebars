'use strict';

// var Handlebars = require('handlebars');
// var includes = require('lodash.includes');
// var isFunction = Handlebars.Utils.isFunction;
// var isUndefined = require('lodash.isundefined');
var sortBy = require('lodash.sortby');
var padLeft = require('lodash.padstart');
var forOwn = require('lodash.forown');

function getNames(rules) {
	var names = [];
	forOwn(rules.helpers, function(helper, name) {
		if (helper && helper.block) names.push(name);
	});

	return names;
	// return ['if'];
}

function getOpens(blocks, lines) {
	var founds = [];
	var regex = new RegExp('{{#[\\s]{0,}(' + blocks.join('|') + ')[\\s]{0,}', 'g');
	// console.log('getOpens()');
	// console.log('* blocks:', blocks);
	// console.log('* regex:', regex);
	// console.log('* lines:', lines);

	lines.forEach(function(line, lineNum) {

		line.replace(regex, function(match, name, offset) {
			founds.push({
				name: name,
				start: {
					line: lineNum,
					column: offset
				},
				end: {
					line: lineNum,
					column: offset + match.length
				}
			});
			return match;
		});
	});
	// console.log('* founds:', founds);
	// console.log();
	return founds;
}
function getElses(blocks, lines) {
	var founds = [];
	var regex = new RegExp('{{[\\s]{0,}else[\\s]{0,}', 'g');
	// console.log('getElses()');
	// console.log('* blocks:', blocks);
	// console.log('* regex:', regex);
	// console.log('* lines:', lines);

	lines.forEach(function(line, lineNum) {

		line.replace(regex, function(match, offset) {
			founds.push({
				name: 'else',
				start: {
					line: lineNum,
					column: offset
				},
				end: {
					line: lineNum,
					column: offset + match.length
				}
			});
			return match;
		});
	});
	// console.log('* founds:', founds);
	// console.log();
	return founds;
}
function getCloses(blocks, lines) {
	var founds = [];
	var regex = new RegExp('{{/[\\s]{0,}(' + blocks.join('|') + ')[\\s]{0,}', 'g');
	// console.log('getClose()');
	// console.log('* blocks:', blocks);
	// console.log('* regex:', regex);
	// console.log('* lines:', lines);

	lines.forEach(function(line, lineNum) {

		line.replace(regex, function(match, name, offset) {
			founds.push({
				name: '/' + name,
				start: {
					line: lineNum,
					column: offset
				},
				end: {
					line: lineNum,
					column: offset + match.length
				}
			});
			return match;
		});
	});
	// console.log('* founds:', founds);
	// console.log();
	return founds;
}

function orderStack(opens, elses, closes) {
	var stack = [].concat(opens, elses, closes);
	// console.log('stack:', stack);
	stack = sortBy(stack, function(item) {
		return padLeft(item.start.line, 10, '0') + ':' + padLeft(item.start.column, 10, '0');
	});
	// console.log('stack:', stack);
	return stack;
}

exports.stack = function(html, rules) {
	var blocks = getNames(rules);
	var lines = html.split('\n');
	var opens = getOpens(blocks, lines);
	var elses = getElses(html, lines);
	var closes = getCloses(blocks, lines);
	var stack = orderStack(opens, elses, closes);

	// temp, so we less visible clutter.
	stack = stack.map(function(item) {
		return {
			name: item.name
		};
	});
	return stack;
};


