# Benny - a dead simple benchmarking framework

![npm](https://img.shields.io/npm/v/benny)
![CircleCI](https://img.shields.io/circleci/build/github/caderek/benny)
![David](https://img.shields.io/david/caderek/benny)
![Codecov](https://img.shields.io/codecov/c/github/caderek/benny)
![GitHub](https://img.shields.io/github/license/caderek/benny)

![Example](benny.gif)

## Table of contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick example](#quick-example)
4. [API](#api)
5. [Working with many suites](#many-suites)
6. [Working with async code](#async-code)
7. [Tweaking benchmarks](#tweaking)
8. [Snippets](#snippets)
9. [Additional examples](#additional-examples)
10. [License](#license)

<a id='overview'></a>

## Overview

Under the hood, Benny uses an excellent (but complex) [benchmark](https://www.npmjs.com/package/benchmark) package.

Benny provides an improved API that allows you to:

- easily prepare benchmarks for synchronous, as well as async code,
- prepare local setup (sync or async) for each case
- skip or run only selected cases
- save essential results to a file in a JSON format
- pretty-print results without additional setup
- use suite results as Promises

Additionally, it provides sound defaults suitable for most use cases and excellent IDE support with built-in type definitions.

<a id='installation'></a>

## Installation

Using NPM:

```sh
npm i benny -D
```

Using Yarn:

```
yarn add benny -D
```

<a id='quick-example'></a>

## Quick example

```js
/* benchmark.js */
const b = require('benny')

b.suite(
  'Example',

  b.add('Reduce two elements', () => {
    ;[1, 2].reduce((a, b) => a + b)
  }),

  b.add('Reduce five elements', () => {
    ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'reduce', version: '1.0.0' }),
)
```

Execute:

```sh
node benchmark.js
```

Output:

```
Running "Example" suite...

  Reduce two elements:
    147 663 243 ops/s, ±0.78%   | fastest

  Reduce five elements:
    118 640 209 ops/s, ±0.93%   | slowest, 19.65% slower

Finished 2 cases!
  Fastest: Reduce two elements
  Slowest: Reduce five elements

Saved to: benchmark/results/reduce.json
```

File content:

```json
{
  "name": "Example",
  "date": "2019-10-01T21:45:13.058Z",
  "version": "1.0.0",
  "results": [
    {
      "name": "Reduce two elements",
      "ops": 147663243,
      "margin": 0.78,
      "percentSlower": 0
    },
    {
      "name": "Reduce five elements",
      "ops": 118640209,
      "margin": 0.93,
      "percentSlower": 19.65
    }
  ],
  "fastest": {
    "name": "Reduce two elements",
    "index": 0
  },
  "slowest": {
    "name": "Reduce five elements",
    "index": 1
  }
}
```

<a id='api'></a>

## API

```js
// You can also use ES Modules syntax and default imports
const { add, complete, cycle, save, suite } = require('benny')

suite(
  /**
   * Name of the suite - required
   */
  "My suite",

  /**
   * If the code that you want to benchmark has no setup,
   * you can run it directly:
   */
  add('My first case', () => {
    myFunction()
  }),

  /**
   * If the code that you want to benchmark requires setup,
   * you should return it wrapped in a function:
   */
  add('My second case', () => {
    // Some setup:
    const testArr = Array.from({ length: 1000 }, (_, index) => index)

    // Benchmarked code wrapped in a function:
    return () => myOtherFunction(testArr)
  }),

  /**
   * This benchmark will be skipped:
   */
  add.skip('My third case', () => {
    1 + 1
  }),

  /**
   * This benchmark will be the only one that runs
   * (unless there are other cases marked by .only)
   */
  add.only('My fourth case', () => {
    Math.max(1, 2, 3, 4, 5)
  }),

  /**
   * This will run after each benchmark in the suite.
   *
   * You can pass a function that takes:
   *   - as a first argument: an object with the current result
   *   - as a second argument: an object with all cases (even unfinished ones)
   * If you return a value, it will be logged,
   * replacing in-place the previous cycle output.
   *
   * By default, it pretty-prints case results
   */
  cycle(),

  /**
   * This will run after all benchmarks in the suite.
   *
   * You can pass a function that takes an object with all results.
   *
   * By default, it pretty-prints a simple summary.
   */
  complete(),

  /**
   * This will save the results to a file.
   * You can pass an options object.
   *
   * By default saves to benchmark/results/<ISO-DATE-TIME>.json
   */
  save({
    /**
     * String or function that produces a string,
     * if function, then results object will be passed as argument:
     */
    file: 'myFileNameWithoutExtension'
    /**
     * Destination folder (can be nested), will be created if not exists:
     */
    folder: 'myFolder',
    /**
     * Version string - if provided will be included in the file content
     */
    version: require('package.json').version,
  }),
)
```

All methods are optional - use the ones you need.

Additionally, each suite returns a `Promise` that resolves with results object (the same as passed to the `complete` method).

<a id="many-suites"></a>

## Working with many suites

You can create as many suites as you want. It is a good practice to define each suite in a separate file, so you can run them independently if you need. To run multiple suites, create the main file, where you import all your suites.

Example:

```js
/* suites/suite-one.js */

const b = require('benny')

module.exports = b.suite(
  'Suite one',

  b.add('Reduce two elements', () => {
    ;[1, 2].reduce((a, b) => a + b)
  }),

  b.add('Reduce five elements', () => {
    ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'reduce' }),
)
```

```js
/* suites/suite-two.js */

const b = require('benny')

module.exports = b.suite(
  'Suite two',

  b.add('Multiple two numbers', () => {
    2 * 2
  }),

  b.add('Multiply three numbers', () => {
    2 * 2 * 2
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'add' }),
)
```

```js
/* benchmark.js */

require('./suites/suite-one')
require('./suites/suite-two')
```

Run:

```
node benchmark.js
```

### Multiple async suites

If your suites contain async benchmarks, you should wrap them in a function (so they wont execute immediately), and use await when calling each of them:

```js
/* suites/async-suite-one.js */

const b = require('benny')

module.exports = () => b.suite(/* ...your async benchmarks */)
```

```js
/* suites/async-suite-two.js */

const b = require('benny')

module.exports = () => b.suite(/* ...your async benchmarks */)
```

```js
/* async-benchmark.js */

const asyncSuite1 = require('./suites/async-suite-one')
const asyncSuite2 = require('./suites/async-suite-two')

const main = async () => {
  await asyncSuite1()
  await asyncSuite2()
}

main()
```

Run:

```
node async-benchmark.js
```

<a id="async-code"></a>

## Working with async code

Benny handles Promises out of the box. You can have async benchmarks, async setup, or both.

To demonstrate how this work, I will use the `delay` function that simulates a long-pending promise:

```js
const delay = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000))
```

### Async benchmark without setup

```js
add('Async benchmark without setup', async () => {
  // You can use await or return - works the same,
  // (async function always returns a Promise)
  await delay(0.5) // Resulting in 2 ops/s
})
```

If a benchmark has many async operations you should await every statement that you want to be completed before the next iteration:

```js
add('Async benchmark without setup - many async operations', async () => {
  await delay(0.5)
  await delay(0.5)
  // Resulting in 1 ops/s
})
```

### Async benchmark with setup - return a promise wrapped in a function

```js
add('Async benchmark with some setup', async () => {
  await delay(2) // Setup can be async, it will not affect the results

  return async () => {
    await delay(0.5) // Still 2 ops/s
  }
})
```

### Synchronous benchmark with async setup

```js
add('Sync benchmark with some async setup', async () => {
  await delay(2) // Setup can be async, it will not affect the results

  return () => {
    1 + 1 // High ops, not affected by slow, async setup
  }
})
```

If we add these cases to a suite and execute it, we will get results that would look similar to this:

```
Running "Async madness" suite...

  Async benchmark without setup:
    2 ops/s, ±0.02%             | 100% slower

  Async benchmark without setup - many async operations:
    1 ops/s, ±0.05%             | slowest, 100% slower

  Async benchmark with some setup:
    2 ops/s, ±0.11%             | 100% slower

  Sync benchmark with some async setup:
    674 553 637 ops/s, ±2.13%   | fastest

Finished 4 cases!
  Fastest: Sync benchmark with some async setup
  Slowest: Async benchmark without setup - many async operations

Saved to: benchmark/results/async-madness.json
```

_Note: If you look closely, because of the `async` keyword, the last two examples return not a function, but a Promise, that resolves to a function, that returns either another Promise or other value (undefined in the last case). Benny is smart enough to get your intent and build proper async or sync benchmark for you._

<a id="tweaking"></a>

## Tweaking benchmarks

If the default results are not optimal (high error margin, etc.), you can change parameters for each case by providing an options object as a third parameter to the `add` function.

Available options:

```typescript
/**
 * The delay between test cycles (secs).
 *
 * @default 0.005
 */
delay: number

/**
 * The default number of times to execute a test on a benchmark's first cycle.
 *
 * @default 1
 */
initCount: number

/**
 * The maximum time a benchmark is allowed to run before finishing (secs).
 *
 * Note: Cycle delays aren't counted toward the maximum time.
 *
 * @default 5
 */
maxTime: number

/**
 * The minimum sample size required to perform statistical analysis.
 *
 * @default 5
 */
minSamples: number

/**
 * The time needed to reduce the percent uncertainty of measurement to 1% (secs).
 *
 * @default 0
 */
minTime: number
```

Example usage:

```js
const b = require('benny')

const options = {
  minSamples: 10,
  maxTime: 2,
}

b.suite(
  'My suite',

  b.add(
    'Reduce two elements',
    () => {
      ;[1, 2].reduce((a, b) => a + b)
    },
    options,
  ),
  // ...other methods
)
```

<a id="snippets"></a>

## Snippets

If you are using Visual Studio Code or [VSCodium](https://github.com/VSCodium/vscodium), you can use following code snippets -> [click](snippets.json)

To add them, open `File -> Preferences -> User Snippets`, chose a language (JS, TS or both) and paste additional keys from the snippets file.

You can see how they work in the demo GIF.

<a id="additional-examples"></a>

## Additional examples

For more examples check out the [/examples](examples) folder.

You can run all the examples locally if you want. Just remember to run `npm i` or `yarn` in the examples folder first.

<a id="license"></a>

## License

Project is under open, non-restrictive [ISC license](LICENSE).
