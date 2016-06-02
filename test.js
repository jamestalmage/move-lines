/* eslint-disable ava/test-title, ava/no-identical-title */
import mapObj from 'map-obj';
import test from 'ava';
import fn from './';

const abcd = () => ['a', 'b', 'c', 'd'];
const abcde = () => ['a', 'b', 'c', 'd', 'e'];
const sp = str => str.split('');

function basicGroup(sep) {
	function basic(t, lineFn, startLine, endLine, move, expected) {
		const input = lineFn().join(sep);

		const result = fn(input, {
			startLine,
			endLine,
			move
		});

		expected = expected.join(sep);

		t.is(result, expected);
	}

	basic.title = (title, l, start, end) => `moves ${(start - end) > 1 ? 'multiple lines' : 'a single line'} ${title} (${JSON.stringify(sep)})`;

	// Single Line Up
	test('up to the top', basic, abcd, 1, 1, -1, sp('bacd'));
	test('up in the middle', basic, abcd, 2, 2, -1, sp('acbd'));
	test('up from the bottom', basic, abcd, 3, 3, -1, sp('abdc'));

	// Multiple Lines Up
	test('up to the top', basic, abcde, 1, 2, -1, sp('bcade'));
	test('up in the middle', basic, abcde, 2, 3, -1, sp('acdbe'));
	test('up from the bottom', basic, abcde, 3, 4, -1, sp('abdec'));

	// Single Line Down
	test('down from the top', basic, abcd, 0, 0, 1, sp('bacd'));
	test('down in the middle', basic, abcd, 1, 1, 1, sp('acbd'));
	test('down to the bottom', basic, abcd, 2, 2, 1, sp('abdc'));

	// Multiple Lines Down
	test('down from the top', basic, abcde, 0, 1, 1, sp('cabde'));
	test('down in the middle', basic, abcde, 1, 2, 1, sp('adbce'));
	test('down to the bottom', basic, abcde, 2, 3, 1, sp('abecd'));
}

basicGroup('\n');
basicGroup('\r\n');

function positionTests(sep, end) {
	const prefix = `${end ? 'end' : 'start'} position (${JSON.stringify(sep)}):`;

	function setup() {
		const array = ['foo', 'bar', 'baz', 'quz'];
		const l = 3 + sep.length;
		let positions = {
			foo: 0,
			bar: l,
			baz: 2 * l,
			quz: 3 * l
		};

		if (end) {
			positions = mapObj(positions, (key, value) => [key, value + 3]);
		}

		return {
			array,
			positions,
			l,
			input: array.join(sep)
		};
	}

	function expectedPositions(array) {
		var obj = {};
		var i = 0;
		array.forEach(name => {
			obj[name] = end ? i + 3 : i;
			i += name.length + sep.length;
		});
		return obj;
	}

	test(`${prefix} move one line up to the top`, t => {
		const {input, positions} = setup();

		const {result, positions: newPositions} = fn.withPositions(
			input,
			{startLine: 1, endLine: 1, move: -1},
			positions
		);

		var expected = ['bar', 'foo', 'baz', 'quz'];
		t.is(result, expected.join(sep));
		t.deepEqual(newPositions, expectedPositions(expected));
	});

	test(`${prefix} move two lines up to the top`, t => {
		const {input, positions} = setup();

		const {result, positions: newPositions} = fn.withPositions(
			input,
			{startLine: 1, endLine: 2, move: -1},
			positions
		);

		var expected = ['bar', 'baz', 'foo', 'quz'];
		t.is(result, expected.join(sep));
		t.deepEqual(newPositions, expectedPositions(expected));
	});

	test(`${prefix} move one line up in the middle`, t => {
		const {input, positions} = setup();

		const {result, positions: newPositions} = fn.withPositions(
			input,
			{startLine: 2, endLine: 2, move: -1},
			positions
		);

		var expected = ['foo', 'baz', 'bar', 'quz'];
		t.is(result, expected.join(sep));
		t.deepEqual(newPositions, expectedPositions(expected));
	});

	test(`${prefix} move one line up from the bottom`, t => {
		const {input, positions} = setup();

		const {result, positions: newPositions} = fn.withPositions(
			input,
			{startLine: 3, endLine: 3, move: -1},
			positions
		);

		var expected = ['foo', 'bar', 'quz', 'baz'];
		t.is(result, expected.join(sep));
		t.deepEqual(newPositions, expectedPositions(expected));
	});
}

positionTests('\n');
positionTests('\r\n');
positionTests('\n', true);
positionTests('\r\n', true);
