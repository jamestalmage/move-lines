'use strict';
var splitLines = require('split-lines');
var mapObj = require('map-obj');

function moveLines(str, opts, oldPositions) {
	var move = opts.move;

	if (!move) {
		return str;
	}

	var lines = splitLines(str, {preserveNewlines: true});

	var startLine = normalizeLineArg(opts.startLine, opts.startCharacter, lines);
	var endLine = normalizeLineArg(opts.endLine, opts.endCharacter, lines) + 1;

	var head = lines.slice(0, startLine);
	var middle = lines.slice(startLine, endLine);
	var tail = lines.slice(endLine);

	var a;
	var b;
	var movedChars = 0;

	if (move < 0) {
		a = middle;
		b = head.slice(move);
		head = head.slice(0, move);
	} else {
		a = tail.slice(0, move);
		b = middle;
		tail = tail.slice(move);
	}

	if (tail.length === 0) {
		// Tail is empty, so the last line of b is the last line. It has a line separator, but the last line shouldn't.
		// The old last line is currently the last line of a, and it is without a line separator.
		// So... swap the line separator from the end of b, to the end of a.
		var len = b.length - 1;
		var lastOfB = b[len];
		var slicePoint = lastOfB.length - 2;

		if (lastOfB[slicePoint] === '\r') {
			movedChars = 2;
		} else {
			slicePoint++;
			movedChars = 1;
		}

		var newlineChars = lastOfB.slice(slicePoint);
		b[len] = lastOfB.slice(0, slicePoint);
		a.push(newlineChars);
	}

	var headJoined = head.join('');
	var aJoined = a.join('');
	var bJoined = b.join('');
	var tailJoined = tail.join('');
	var newPositions;

	if (oldPositions) {
		var downMove = {
			start: headJoined.length,
			end: headJoined.length + bJoined.length + movedChars,
			by: aJoined.length
		};

		var upMove = {
			start: downMove.end,
			end: downMove.end + aJoined.length,
			by: -(bJoined.length + movedChars)
		};

		newPositions = mapObj(oldPositions, function (key, value) {
			if (value >= downMove.start && value < downMove.end) {
				value += downMove.by;
			} else if (value >= upMove.start && value < upMove.end) {
				value += upMove.by;
			}
			return [key, value];
		});
	}

	return {
		result: headJoined + aJoined + bJoined + tailJoined,
		positions: newPositions
	};
}

module.exports = function (str, opts) {
	return moveLines(str, opts).result;
};

module.exports.withPositions = moveLines;

function normalizeLineArg(lineNum, position, lines) {
	if (typeof lineNum === 'number') {
		return lineNum;
	}

	var start = 0;

	for (var i = 0; i < lines.length; i++) {
		start += lines[i].length;
		if (position < start) {
			return i;
		}
	}
}
