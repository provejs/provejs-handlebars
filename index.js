'use strict';

require('colors');

exports.linter = function (config, ast) {
	var nodes = ast.body || ast;
	var statements = nodes.filter(isStatement);
	var helpers = statements.filter(isHelper);
	helpers.forEach(print);
	// console.log('statements', statements);
};

function print(statement) {
	var name = statement.path.original;
	var params = statement.params;
	var hash = statement.hash;
	var parts = statement.path.parts;
	// console.log('statement:'.cyan, statement);
	console.log();
	console.log('name:'.magenta, name);
	console.log('params:'.cyan, params);
	console.log('hash:'.cyan, hash);
	console.log('parts:'.cyan, parts);

};

function isHelper(node) {
	if (node.params.length > 0) return true;
	if (node.hash !== undefined) return true;
	return false;
}

function isStatement(node) {
	return node.type === 'MustacheStatement';
}
