'use strict';

function collapse(blocks, stack) {
	console.log('collapse()');
	console.log('stack:', stack);
	console.log();
	blocks.forEach(function(block) {
		collapseBlock(block, stack);
	});

	console.log('stack:');
	console.log(stack);

	return stack;
}

function ignored(stack) {
	var cnt = 0;
	stack.forEach(function(item) {
		if (item.ignore) cnt++;
	});
	return cnt;
}

function isOpen(item) {
	if (item.name === 'else') return false;
	if (item.name === 'elseif') return false;
	if (item.name[0] === '/') return false;
	return true;
}

function isElse(item) {
	if (item.name === 'else') return true;
	if (item.name === 'elseif') return true;
	return false;
}

function isClose(item, block) {
	if (item.name === '/' + block) return true;
	return false;
}

function isBlock(item, block) {
	return item.name === block || item.name === '/' + block;
}

function isIgnore(item) {
	return item.ignore;
}

function collapseBlock(block, stack) {

	var last = ignored(stack);
	console.log('collapseBlock()');
	console.log('* block:', block);
	console.log('* last:', last);


	stack.forEach(function(item, index) {
		// var name = item.name;
		var isOpenBlock = !isIgnore(item) && isOpen(item) && isBlock(item, block);
		if (isOpenBlock) collapseBlockItem(block, index, stack);
	});

	// recursive
	if (last !== ignored(stack)) collapseBlock(block, stack);
}

function collapseBlockItem(block, indexOpen, stack) {
	console.log('collapseBlockItem()');
	var indexClose = findNextCloseIndex(block, indexOpen, stack);
	if (indexClose) ignoreStackItems(indexOpen, indexClose, stack);
	return stack;
}

function findNextCloseIndex(block, index, stack) {
	console.log('findNextCloseIndex()');
	console.log('* block:', block);
	console.log('* index:', index);
	var found;
	for (var idx = index + 1; idx < stack.length; idx++) {
		var item = stack[idx];
		// console.log('* isIgnore:', isIgnore(item));
		// console.log('* isElse:', isElse(item));
		// console.log('* isClose:', isClose(item, block));
		// console.log('* isBlock:', isBlock(item, block));
		if (isIgnore(item)) continue;
		if (isElse(item)) continue;
		if (isBlock(item, block) && isClose(item, block)) found = idx;
		break;
	}
	console.log('* found:', found);
	return found;
}

function ignoreStackItems(indexOpen, indexClose, stack) {
	stack.forEach(function(item, idx) {
		var ignore = indexOpen <= idx && idx <= indexClose;
		if (ignore) item.ignore = true;
	});
}

exports.stack = function(stack, blocks) {

	// mark the entire stack ignored
	stack = stack.map(function(item) {
		item.ignore = false;
		return item;
	});

	blocks = ['if'];

	var issues = collapse(blocks, stack);
	return issues;
};
