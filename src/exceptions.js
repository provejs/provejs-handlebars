(function () {
	'use strict';

	var regex1 = /^Parse error on line ([0-9]+)+:\n([^\n].*)\n([^\n].*)\n(.*)$/;
	var regex2 = /^(.*) - ([0-9]+):([0-9]+)$/;

	function friendlyMessage(message) {
		if (message.indexOf("got 'INVALID'") !== -1) return 'invalid Handlebars expression';
		if (message === "Expecting 'EOF', got 'OPEN_ENDBLOCK'") return 'invalid closing block, check opening block';
		if (message === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE'") return 'empty Handlebars expression';
		if (message === "Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'EOF'") return 'invalid Handlebars expression';
		if (message === "Expecting 'CLOSE_RAW_BLOCK', 'CLOSE', 'CLOSE_UNESCAPED', 'OPEN_SEXPR', 'CLOSE_SEXPR', 'ID', 'OPEN_BLOCK_PARAMS', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', 'SEP', got 'OPEN'") return 'invalid Handlebars expression';
		if (message === "Expecting 'CLOSE', 'OPEN_SEXPR', 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'CLOSE_RAW_BLOCK'") return 'invalid Handlebars expression';
		if (message.indexOf("', got '") !== -1) return 'invalid Handlebars expression';
		return message;
	}

	var parser = function (e, html) {
		var parsed = {};
		var lines;
		if (!e) return;
		if (typeof e.message !== 'string') return;
		if (typeof html !== 'string') return;

		lines = html.split('\n');

		function getPos(lineNum, code, indicator) {

			var line, min, max, dots = false, prefix = 0;

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

			if (min === -1) {
				return {
					min: 0,
					max: 0
				};
			} else {
				return {
					min: min,
					max: max
				};
			}
		}

		e.message.replace(regex1, function (match, lineNum, code, indicator, message) {

			var pos;
			lineNum = +lineNum;
			lineNum = lineNum - 1;
			pos = getPos(lineNum, code, indicator);

			//console.log('pos:', pos);

			parsed.minLine = lineNum;
			parsed.minColumn = pos.min;
			parsed.maxLine = lineNum;
			parsed.maxColumn = pos.max;
			parsed.message = friendlyMessage(message);
			return '';
		});
		e.message.replace(regex2, function(match, message, lineNum, columnNum) {

			lineNum = +lineNum;
			lineNum = lineNum - 1;
			columnNum = +columnNum;
			columnNum = columnNum - 1;

			parsed.minLine = lineNum;
			parsed.minColumn = columnNum;
			parsed.maxLine = parsed.minLine;
			parsed.maxColumn = parsed.minColumn + 1;
			parsed.message = friendlyMessage(message);
			return '';
		});
		return parsed;
	};

	if ('undefined' !== typeof window) { // eslint-disable-line no-undef
		window.HandlebarsErrorParser = parser; // eslint-disable-line no-undef
	}

	if ('undefined' !== typeof module) { // eslint-disable-line no-undef
		exports.parser = parser; // eslint-disable-line no-undef
	}
})();
