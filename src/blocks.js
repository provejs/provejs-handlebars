'use strict';

// var Handlebars = require('handlebars');
// var includes = require('lodash.includes');
// var isFunction = Handlebars.Utils.isFunction;
// var isUndefined = require('lodash.isundefined');
var forOwn = require('lodash.forown');

function getBlockNames(rules) {
	var names = [];
	forOwn(rules.helpers, function(helper, name) {
		if (helper && helper.block) names.push(name);
	});
	return names;
}


function checkOpenBlock(block, lines) {

	var issue;
	var regex = new RegExp('{{[\\s]{0,}' + block + '[\\s]{0,}');
	// console.log('checkOpenBlock()');
	// console.log('* block:', block);
	// console.log('* regex:', regex);

	lines.forEach(function(line, lineNum) {
		if (issue) return false;
		var column = line.search(regex);

		if (column !== -1) {
			issue = {
				severity: 'error',
				message: 'The {{' + block + '}} block helper requires a `#` before its name.',
				type: 'BLOCK-OPEN-WRONG',
				start: {
					line: lineNum,
					column: column
				},
				end: {
					line: lineNum,
					column: column - '{{'.length + block.length
				}
			};
		}
	});
	// if (issue) console.log('* issue:', issue);
	return issue;
}

// check for opening blocks which are missing '#'
function checkOpenBlocks(blocks, html) {
	var issues = [];
	var lines = html.split('\n');
	blocks.forEach(function(block) {
		var issue = checkOpenBlock(block, lines);
		if (issue) issues.push(issue);
	});
	return issues;
}

exports.lint = function(html, rules) {
	var blocks = getBlockNames(rules);
	var issues = checkOpenBlocks(blocks, html);
	return issues;
};


