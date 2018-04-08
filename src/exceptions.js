'use strict';

var regex1 = /^Parse error on line ([0-9]+)+:\n([^\n].*)\n([^\n].*)\n(.*)$/;
var regex2 = /^(.*) - ([0-9]+):([0-9]+)$/;
var Messages = require('./messages');

function getPos(lines, lineNum, code, indicator) {

	var line, min, max, dots = false, prefix = 0;
	var pos = {};

	// console.log('code', code);

	// handle special cases
	if (code === '{{{{') {
		pos.min = 0;
		pos.max = 4;
		return pos;
	} else if (code === '{{{') {
		pos.min = 0;
		pos.max = 3;
		return pos;
	} else  if (code === '{{') {
		pos.min = 0;
		pos.max = 2;
		return pos;
	} else if (code.indexOf('{{<') !== -1) {
		pos.min = lines[lineNum].indexOf('{{<');
		pos.max = pos.min + 3;
		return pos;
	} else if (code === '{{}}') {
		pos.min = 0;
		pos.max = 4;
		return pos;
	} else if (code.indexOf('{{{}}{') !== -1) {
		pos.min = lines[lineNum].indexOf('{{{}}}');
		pos.max = pos.min + 6;
		return pos;
	} else if (code.indexOf('{{#}}') !== -1) {
		pos.min = lines[lineNum].indexOf('{{#}}');
		pos.max = pos.min + 5;
		return pos;
	}

	// trim off extra prefix and suffix from code which
	// could force us to not find the pos in the line.
	code = code.substring(0, indicator.length);
	code = code.replace('...', function() {
		dots = true;
		return '';
	});

	prefix = code.indexOf('{{');
	line = lines[lineNum];
	min = line.indexOf(code);
	min = min + prefix;
	max = (!dots)
		? min + indicator.length - 1
		: min + indicator.length - 4;

	if (min === max) max++;

	if (min === -1) {
		return {
			min: 0,
			max: 1
		};
	} else {
		return {
			min: min,
			max: max
		};
	}
}

exports.parser = function (e, html) {
	var parsed = {};
	var lines;
	if (!e) return;
	if (typeof e.message !== 'string') return;
	if (typeof html !== 'string') return;

	lines = html.split('\n');

	e.message.replace(regex1, function (match, lineNum, code, indicator, message) {

		// console.log('regex1');
		// console.log(match);

		var pos;
		lineNum = +lineNum;
		lineNum = lineNum - 1;
		pos = getPos(lines, lineNum, code, indicator);

		// console.log('pos:', pos);

		parsed.start = {
			line: lineNum,
			column: pos.min
		};
		parsed.end = {
			line: lineNum,
			column: pos.max
		};
		parsed.message = Messages.parser(message, code);
		parsed.severity = 'error';
		return '';
	});
	e.message.replace(regex2, function(match, message, lineNum, columnNum) {

		// console.log('regex2');
		// console.log(match)

		lineNum = +lineNum;
		lineNum = lineNum - 1;
		columnNum = +columnNum;

		parsed.start = {
			line: lineNum,
			column: columnNum
		};
		parsed.end = {
			line: parsed.start.line,
			column: parsed.start.column + 1
		};
		parsed.message = Messages.parser(message);
		parsed.severity = 'error';
		return '';
	});
	return parsed;
};
