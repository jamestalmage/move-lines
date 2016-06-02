# move-lines [![Build Status](https://travis-ci.org/jamestalmage/move-lines.svg?branch=master)](https://travis-ci.org/jamestalmage/move-lines) [![Coverage Status](https://coveralls.io/repos/github/jamestalmage/move-lines/badge.svg?branch=master)](https://coveralls.io/github/jamestalmage/move-lines?branch=master)

> Move around lines in a string.


## Install

```
$ npm install --save move-lines
```


## Usage

```js
const moveLines = require('move-lines');

const input = ['a', 'b', 'c', 'd'].join('\n');

// move 2nd line down 1
moveLines(input, {startLine: 1, endLine: 1, move: 1});
//=> ['a', 'c', 'b', 'd'].join('\n');

// move 2nd and 3rd lines up 1
moveLines(input, {startLine: 1, endLine: 2, move: -1});
//=> ['b', 'c', 'a', 'd'].join('\n');

// You can also reposition string position indexes
const result = moveLines.withPositions(
  input,
  {startLine: 0, endLine:1, move: 1},
  {selectionStart: 0, selectionEnd: 3, foo: 7}
);

result.positions;
//=> {selectionStart: 2, selectionEnd: 5, foo: 7}
```


## API

### moveLines(input, options)

Moves lines of `input` around according to `options`, returns the resulting string.

#### input

Type: `string`

A string containing lines you want moved around

#### options

##### startLine

Type: `number`

The starting line to be moved. Zero based. Inclusive.

##### endLine

Type: `number`

The ending line to be moved. Zero based. Inclusive.

##### move

Type: `number`

How many lines to move. Negative numbers move lines up. Positive numbers move lines down.

### moveLines.withPositions(input, options, positions)

Same as `moveLines()`, but it takes a hash of positions (all of which must be `numbers`).

The returned `Object` has two properties:

- `result`: A `string` with the modified
- `positions`: Will have all the same properties as the `positions` input, but the indexes will be adjusted according to the move.

## License

MIT © [James Talmage](http://github.com/jamestalmage)
