'use strict';


exports.helpers = function(nodes, names) {

	console.log('nodes', JSON.stringify(nodes));

	var helpers = nodes.filter(function(node) {
		if (node.type !== 'MustacheStatement' && node.type !== 'BlockStatement') return false;
		if (node.params.length > 0) return true;
		if (node.hash !== undefined) return true;
		if (includes(names, node.path.original)) return true; // helper with no hash or params
		return false;
	});

	helpers = helpers.map(pruneHelpers);
	return helpers;
};
