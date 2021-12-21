# Benny - a dead simple benchmarking framework

![npm](https://img.shields.io/npm/v/benny)
![CircleCI](https://img.shields.io/circleci/build/github/caderek/benny)
![Codecov](https://img.shields.io/codecov/c/github/caderek/benny)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/benny)
![GitHub](https://img.shields.io/github/license/caderek/benny)

![Example](https://raw.githubusercontent.com/caderek/benny/master/benny.gif)

## Table of contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick example](#quick-example)
4. [API](#api)
5. [Working with many suites](#many-suites)
6. [Working with async code](#async-code)
7. [Tweaking benchmarks](#tweaking)
8. [Code reuse](#code-reuse)
9. [Snippets](#snippets)
10. [Additional examples](#additional-examples)
11. [License](#license)

<a id='overview'></a>

## Overview

Benny builds on top of the excellent (but complex) [benchmark](https://www.npmjs.com/package/benchmark) package.

Benny provides an improved API that allows you to:

- easily prepare benchmarks for synchronous, as well as async code,
- prepare local setup (sync or async) for each case,
- skip or run only selected cases,
- save results to a JSON / CSV / HTML (table or chart) file,
- pretty-print results without additional setup,
- use suite results as Promises.

Additionally, it provides sound defaults suitable for most use cases (that you can tweak if you need) and excellent IDE support with built-in type definitions.

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
  b.save({ file: 'reduce', format: 'chart.html' }),
)
```

---

Execute:

```sh
node benchmark.js
```

---

Output:

```
Running "Example" suite...
Progress: 100%

  Reduce two elements:
    213 985 744 ops/s, ±0.61%   | fastest

  Reduce five elements:
    109 395 371 ops/s, ±0.66%   | slowest, 48.88% slower

Finished 2 cases!
  Fastest: Reduce two elements
  Slowest: Reduce five elements

Saved to: benchmark/results/reduce.json

Saved to: benchmark/results/reduce.chart.html
```

---

JSON file content:

```json
{
  "name": "Example",
  "date": "2021-10-02T03:00:10.907Z",
  "version": "1.0.0",
  "results": [
    {
      "name": "Reduce two elements",
      "ops": 213985744,
      "margin": 0.61,
      "percentSlower": 0
    },
    {
      "name": "Reduce five elements",
      "ops": 109395371,
      "margin": 0.66,
      "percentSlower": 48.88
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

Note: If you use the `{ details: true }` option in your save function, you will get the result similar to this one:

<details>
<summary>click to expand</summary>
<pre lang="json">
{
  "name": "Example",
  "date": "2021-10-02T03:29:32.520Z",
  "version": "1.0.0",
  "results": [
    {
      "name": "Reduce two elements",
      "ops": 213928866,
      "margin": 0.68,
      "options": {
        "delay": 0.005,
        "initCount": 1,
        "minTime": 0.05,
        "maxTime": 5,
        "minSamples": 5
      },
      "samples": 92,
      "promise": false,
      "details": {
        "min": 4.430438606424907e-9,
        "max": 5.0581801724029255e-9,
        "mean": 4.6744509956552405e-9,
        "median": 4.656646139027003e-9,
        "standardDeviation": 1.5617421028409467e-10,
        "marginOfError": 3.191328246925009e-11,
        "relativeMarginOfError": 0.6827172324389006,
        "standardErrorOfMean": 1.628228697410719e-11,
        "sampleVariance": 2.439038395786062e-20,
        "sampleResults": [
          4.430438606424907e-9,
          ...other 
        ]
      },
      "completed": true,
      "percentSlower": 0
    },
    {
      "name": "Reduce five elements",
      "ops": 109203399,
      "margin": 0.92,
      "options": {
        "delay": 0.005,
        "initCount": 1,
        "minTime": 0.05,
        "maxTime": 5,
        "minSamples": 5
      },
      "samples": 90,
      "promise": false,
      "details": {
        "min": 8.963947485831316e-9,
        "max": 1.2164955890034665e-8,
        "mean": 9.15722416437813e-9,
        "median": 9.072483556407842e-9,
        "standardDeviation": 4.0880731896036814e-10,
        "marginOfError": 8.446046713469782e-11,
        "relativeMarginOfError": 0.9223370053913447,
        "standardErrorOfMean": 4.309207506872338e-11,
        "sampleVariance": 1.6712342403556417e-19,
        "sampleResults": [
          8.963947485831316e-9,
          ...other 
        ]
      },
      "completed": true,
      "percentSlower": 48.95
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
</pre>
</details>

---

HTML chart (it uses Chart.js on canvas, so you can save it as PNG by right-clicking on it):

![chart](https://raw.githubusercontent.com/caderek/benny/master/chart.png)

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
   * You can use this function multiple times with different handlers.
   *
   * By default, it pretty-prints case results
   */
  cycle(),

  /**
   * This will run after all benchmarks in the suite.
   *
   * You can pass a function that takes an object with all results.
   *
   * You can use this function multiple times with different handlers.
   *
   * By default, it pretty-prints a simple summary.
   */
  complete(),

  /**
   * This will set the config for the whole suite.
   *
   * All entries are optional.
   */
  configure({
    /**
     * Benchmark options for every case.
     *
     * Can be overridden by each individual case (as a third parameter to the `add` method).
     *
     * See: "Tweaking benchmarks" section.
     */
    cases: {
      ...optionsForEveryTestCase,
    },
    /**
     * Other general setting for the whole suite.
     */

    /**
     * The minimum precision (decimal places) of the results displayed
     * by the default `cycle`, `complete` and `save` functions.
     *
     * This precision will be automatically increased if needed.
     *
     * Default: 0 (no decimal places, unless required to differentiate cases)
     */
    minDisplayPrecision: 2,
  }),

  /**
   * This will save the results to a file.
   * You can pass an options object.
   *
   * You can use this function multiple times
   * if you need multiple output files with different options.
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
    /**
     * A flag that indicates whether detailed or simplified result will be saved
     * Default: false (simplified results)
     */
    details: true,
    /**
     * Output format, currently supported:
     *   'json' | 'csv' | 'table.html' | 'chart.html'
     * Default: 'json'
     */
    format: 'csv',
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

If your suites contain async benchmarks, you should wrap them in a function (so they wont execute immediately), and use await when calling each of them. That way the results of many suites won't interfere with each other.

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

You can also provide non-default, general settings for every case under `cases` key in the `configure` function.

Priority of the options:

1. options passed to the `add` function,
2. options passed to the `configure` function,
3. library defaults

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

<a id="code-reuse"></a>

## Code reuse

You may wonder why I chose functions over chainable methods - it allows you to better reuse your code while keeping the API minimal and instead leveraging the language itself.

### Reusing benchmark options

If you have many cases, where default benchmarking options are not optimal, you can decorate the `add` function and use the new function instead, for example:

```js
/**
 * Let's import and add `function` and rename it to `rawAdd`.
 * You can also import it unchanged, and give the decorating function
 * a different name - that would be a better approach
 * if you want to use a decorated version only in some cases.
 */
const { add } = require('benny')

const customAdd = (caseName, fn) =>
  add(caseName, fn, {
    /* custom options */
  })
```

You can now use this new function instead of the original version in your benchmark suite.

_TIP: If you want to provide custom options for every case in the suite, you can use `configure` function instead of this._

### Reusing handlers

If you use custom handlers for `cycle` and `complete` functions (or you have custom options for `save` function) you can set up them once, and reuse everywhere you need.

For example:

```js
/* helpers/handlers.js */
const { complete, cycle, save } = require('benny')

const handlers = (fileName) => {
  return [
    cycle((currentResult, summary) => {
      /* your custom cycle handling goes here */
    }),
    complete((summary) => {
      /* your custom complete handling goes here */
    }),
    save({ file: fileName /* other custom save options */ }),
  ]
}

module.exports = handlers
```

You can now reuse it, using the spread operator:

```js
const { add, suite } = require('benny')
const handlers = require('./helpers/handlers')

module.exports = suite(
  'My suite',
  add(/* benchmark setup */),
  add(/* benchmark setup */),
  add(/* benchmark setup */),

  ...handlers('my-suite'),
)
```

### Parameterized cases

There will often be the case, that you want to run very similar benchmarks, that differ very slightly, and can be parameterized, for example, let's say that we want to check the performance of our code for different size of the array:

Instead of:

```js
const { add, cycle, suite } = require('benny')

suite(
  'Reduce',

  add('Raw JS 10 elements', () => {
    const input = Array.from({ length: 10 }, (_, i) => i)

    return () => input.reduce((a, b) => a + b)
  }),

  add('Raw JS 1000 elements', () => {
    const input = Array.from({ length: 1000 }, (_, i) => i)

    return () => input.reduce((a, b) => a + b)
  }),

  add('Raw JS 1000000 elements', () => {
    const input = Array.from({ length: 1000000 }, (_, i) => i)

    return () => input.reduce((a, b) => a + b)
  }),

  cycle(),
)
```

You can auto-generate cases like this:

```js
const { add, cycle, suite } = require('benny')

const testManySizes = (...sizes) =>
  sizes.map((size) => {
    return add(`Raw JS ${size} elements`, () => {
      const input = Array.from({ length: size }, (_, i) => i)

      return () => input.reduce((a, b) => a + b)
    })
  })

module.exports = suite(
  'Reduce',

  ...testManySizes(10, 1000, 1000000),

  cycle(),
)
```

Similarly, you can test many implementations of the same function:

Instead of:

```js
const { add, cycle, suite } = require('benny')
const A = require('@arrows/array')
const R = require('ramda')
const _ = require('lodash/fp')

const input = Array.from({ length: 100 }, (_, i) => i)

module.exports = suite(
  'Reduce',

  add('Ramda', () => {
    R.reduce((a, b) => a + b, 0)(input)
  }),

  add('Arrows', () => {
    A.reduce((a, b) => a + b, 0)(input)
  }),

  add('Lodash', () => {
    _.reduce((a, b) => a + b, 0)(input)
  }),

  cycle(),
)
```

You can auto-generate cases like this:

```js
const { add, cycle, suite } = require('benny')
const A = require('@arrows/array')
const R = require('ramda')
const _ = require('lodash/fp')

const input = Array.from({ length: 100 }, (_, i) => i)

const testManyImplementations = (...cases) =>
  cases.map(([name, fn]) => {
    return add(name, () => {
      fn((a, b) => a + b, 0)(input)
    })
  })

module.exports = suite(
  'Reduce',

  ...testManyImplementations(
    ['Ramda', R.reduce],
    ['Arrows', A.reduce],
    ['Lodash', _.reduce],
  ),

  cycle(),
)
```

---

These are the three most useful techniques - you can combine them together to achieve less repetition in your benchmark code. Just remember to not overuse them - benchmarks, just like tests, should remain straightforward.

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

Project is under open, non-restrictive [ISC license](LICENSE.md).
