import * as csvReader from 'csvtojson'
import * as fs from 'fs-extra'
import { JSDOM } from 'jsdom'
import { add, complete, configure, cycle, save, suite } from './index'
import { CaseResult, CSVContent, Summary } from './internal/common-types'

const TIMEOUT = 30000

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('suite', () => {
  beforeAll(() => {
    fs.removeSync('benchmark')
  })

  afterEach(() => {
    fs.removeSync('benchmark')
  })

  it(
    'Works with defaults and direct cases',
    async () => {
      await suite(
        'Example 1',

        add(
          'First',
          () => {
            ;[1, 2].reduce((a, b) => a + b)
          },
          { maxTime: 5 },
        ),

        add('Second', () => {
          ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        add('Third', () => {
          ;[1, 2, 3].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save(),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(3)
      expect(content.results[0].name).toEqual('First')
      expect(content.results[1].name).toEqual('Second')
      expect(content.results[2].name).toEqual('Third')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[1].ops).toEqual('number')
      expect(typeof content.results[2].ops).toEqual('number')
      expect(typeof content.results[0].margin).toEqual('number')
      expect(typeof content.results[1].margin).toEqual('number')
      expect(typeof content.results[2].margin).toEqual('number')
      expect(typeof content.results[0].percentSlower).toEqual('number')
      expect(typeof content.results[1].percentSlower).toEqual('number')
      expect(typeof content.results[2].percentSlower).toEqual('number')
      expect(typeof content.fastest.name).toEqual('string')
      expect(typeof content.slowest.name).toEqual('string')
      expect(typeof content.fastest.index).toEqual('number')
      expect(typeof content.slowest.index).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with defaults and cases returned in wrapping function',
    async () => {
      await suite(
        'Example 2',

        add('First', () => {
          return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          return () => [1, 2].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save(),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(2)
      expect(content.results[0].name).toEqual('First')
      expect(content.results[1].name).toEqual('Second')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[1].ops).toEqual('number')
      expect(typeof content.results[0].margin).toEqual('number')
      expect(typeof content.results[1].margin).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with .only and direct cases',
    async () => {
      await suite(
        'Example 3',

        add.only('First', () => {
          ;[1, 2].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save(),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(1)
      expect(content.results[0].name).toEqual('First')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[0].margin).toEqual('number')
      expect(content.fastest.name).toEqual('First')
      expect(content.fastest.index).toEqual(0)
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with .only and cases returned in wrapping function',
    async () => {
      await suite(
        'Example 4',

        add.only('First', () => {
          return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          return () => [1, 2].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save(),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(1)
      expect(content.results[0].name).toEqual('First')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[0].margin).toEqual('number')
      expect(content.fastest.name).toEqual('First')
      expect(content.fastest.index).toEqual(0)
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with .skip',
    async () => {
      await suite(
        'Example 5',

        add.skip('First', () => {
          ;[1, 2].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save(),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(1)
      expect(content.results[0].name).toEqual('Second')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[0].margin).toEqual('number')
      expect(content.fastest.name).toEqual('Second')
      expect(content.fastest.index).toEqual(0)
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with custom save options',
    async () => {
      await suite(
        'Example 6',

        add('First', () => {
          ;[1, 2].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save({
          file: 'foo',
          folder: 'benchmark/bar',
          version: '1.2.3',
          details: true,
        }),
      )

      await delay(1000)

      const content = JSON.parse(
        fs.readFileSync(`benchmark/bar/foo.json`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(2)
      expect(content.results[0].name).toEqual('First')
      expect(content.results[1].name).toEqual('Second')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[1].ops).toEqual('number')
      expect(typeof content.results[0].margin).toEqual('number')
      expect(typeof content.results[1].margin).toEqual('number')
      expect(typeof content.results[0].details).toEqual('object')
      expect(typeof content.results[1].details).toEqual('object')
      expect(content.version).toEqual('1.2.3')
    },
    TIMEOUT,
  )

  it(
    'Returns a Promise with the array of results - default options',
    async () => {
      const summary = await suite(
        'Example 7',

        add('First', () => {
          ;[1, 2].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save({
          file: 'foo',
          folder: 'benchmark/bar',
          version: '1.2.3',
        }),
      )

      const { results, date } = summary

      expect(date).toBeInstanceOf(Date)
      expect(results).toBeInstanceOf(Array)
      expect(results.length).toEqual(2)

      expect(typeof results[0].ops).toEqual('number')
      expect(results[0].name).toEqual('First')
      expect(results[0].promise).toEqual(false)
      expect(typeof results[0].samples).toEqual('number')
      expect(results[0].options.delay).toEqual(0.005)
      expect(results[0].options.initCount).toEqual(1)
      expect(results[0].options.minTime).toEqual(0.05)
      expect(results[0].options.maxTime).toEqual(5)
      expect(results[0].options.minSamples).toEqual(5)

      expect(typeof results[1].ops).toEqual('number')
      expect(results[1].name).toEqual('Second')
      expect(results[1].promise).toEqual(false)
      expect(typeof results[1].samples).toEqual('number')
      expect(results[1].options.delay).toEqual(0.005)
      expect(results[1].options.initCount).toEqual(1)
      expect(results[1].options.minTime).toEqual(0.05)
      expect(results[1].options.maxTime).toEqual(5)
      expect(results[1].options.minSamples).toEqual(5)
    },
    TIMEOUT,
  )

  it(
    'Returns a Promise with the array of results - default options',
    async () => {
      const summary = await suite(
        'Example 7',

        add('First', () => {
          ;[1, 2].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        cycle(),
        complete(),
        save({
          file: 'foo',
          folder: 'benchmark/bar',
          version: '1.2.3',
        }),
      )

      const { results, date } = summary

      expect(date).toBeInstanceOf(Date)
      expect(results).toBeInstanceOf(Array)
      expect(results.length).toEqual(2)

      expect(typeof results[0].ops).toEqual('number')
      expect(results[0].name).toEqual('First')
      expect(results[0].promise).toEqual(false)
      expect(typeof results[0].samples).toEqual('number')
      expect(results[0].options.delay).toEqual(0.005)
      expect(results[0].options.initCount).toEqual(1)
      expect(results[0].options.minTime).toEqual(0.05)
      expect(results[0].options.maxTime).toEqual(5)
      expect(results[0].options.minSamples).toEqual(5)

      expect(typeof results[1].ops).toEqual('number')
      expect(results[1].name).toEqual('Second')
      expect(results[1].promise).toEqual(false)
      expect(typeof results[1].samples).toEqual('number')
      expect(results[1].options.delay).toEqual(0.005)
      expect(results[1].options.initCount).toEqual(1)
      expect(results[1].options.minTime).toEqual(0.05)
      expect(results[1].options.maxTime).toEqual(5)
      expect(results[1].options.minSamples).toEqual(5)
    },
    TIMEOUT,
  )

  it(
    'Cycle functions receives current case result',
    async () => {
      try {
        const result: CaseResult = await new Promise((resolve) => {
          suite(
            'Example 9',

            add('First', () => {
              ;[1, 2].reduce((a, b) => a + b)
            }),

            cycle(resolve),
            complete(),
            save({
              file: 'foo',
              folder: 'benchmark/bar',
              version: '1.2.3',
            }),
          )
        })
        expect(result).toBeInstanceOf(Object)

        expect(typeof result.ops).toEqual('number')
        expect(result.name).toEqual('First')
        expect(result.promise).toEqual(false)
        expect(typeof result.samples).toEqual('number')
        expect(result.options.delay).toEqual(0.005)
        expect(result.options.initCount).toEqual(1)
        expect(result.options.minTime).toEqual(0.05)
        expect(result.options.maxTime).toEqual(5)
        expect(result.options.minSamples).toEqual(5)
      } catch (error) {
        console.log(error)
      }
    },
    TIMEOUT,
  )

  it(
    'Complete functions receives all results',
    async () => {
      const summary: Summary = await new Promise((resolve) => {
        suite(
          'Example 10',

          add('First', () => {
            ;[1, 2].reduce((a, b) => a + b)
          }),

          add('Second', () => {
            ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
          }),

          cycle(),
          complete(resolve),
          save({
            file: 'foo',
            folder: 'benchmark/bar',
            version: '1.2.3',
          }),
        )
      })

      const { results, date } = summary

      expect(date).toBeInstanceOf(Date)
      expect(results).toBeInstanceOf(Array)
      expect(results.length).toEqual(2)

      expect(typeof results[0].ops).toEqual('number')
      expect(results[0].name).toEqual('First')
      expect(results[0].promise).toEqual(false)
      expect(typeof results[0].samples).toEqual('number')
      expect(results[0].options.delay).toEqual(0.005)
      expect(results[0].options.initCount).toEqual(1)
      expect(results[0].options.minTime).toEqual(0.05)
      expect(results[0].options.maxTime).toEqual(5)
      expect(results[0].options.minSamples).toEqual(5)

      expect(typeof results[1].ops).toEqual('number')
      expect(results[1].name).toEqual('Second')
      expect(results[1].promise).toEqual(false)
      expect(typeof results[1].samples).toEqual('number')
      expect(results[1].options.delay).toEqual(0.005)
      expect(results[1].options.initCount).toEqual(1)
      expect(results[1].options.minTime).toEqual(0.05)
      expect(results[1].options.maxTime).toEqual(5)
      expect(results[1].options.minSamples).toEqual(5)
    },
    TIMEOUT,
  )

  it(
    'When test returns a promise that resolves to function that returns non-promise, runs returned function as ordinary test',
    async () => {
      const summary = await suite(
        'Example 11',

        add('Delay as a promise', async () => {
          await delay(1000) // simulating some async setup for standard sync test

          return () => 1 + 1
        }),

        cycle(),
        complete(),
      )

      const result = summary.results[0]

      expect(result.ops).toBeGreaterThan(1)
    },
    TIMEOUT,
  )

  it(
    'When test returns a promise that resolves to function that returns a promise, runs returned function with automatic awaiting between iterations',
    async () => {
      const summary = await suite(
        'Example 12',

        add('Delay as a promise', async () => {
          await delay(2000) // simulating some async setup for standard async test

          // Setup will not affect results, still 1 ops/s
          return () => delay(1000)
        }),

        cycle(),
        complete(),
      )

      const result = summary.results[0]

      expect(result.ops).toEqual(1)
    },
    TIMEOUT,
  )

  it(
    'When test returns an other Promise, awaits automatically between each iteration',
    async () => {
      const summary = await suite(
        'Example 13',

        add('Delay as a promise', () => {
          return delay(1000)
        }),

        cycle(),
        complete(),
      )

      const result = summary.results[0]

      expect(result.ops).toEqual(1)
    },
    TIMEOUT,
  )

  it(
    'When test returns a function that returns a Promise, awaits automatically between each iteration',
    async () => {
      const summary = await suite(
        'Example 14',

        add('Delay as a promise', () => {
          return () => delay(1000)
        }),

        cycle(),
        complete(),
      )

      const result = summary.results[0]

      expect(result.ops).toEqual(1)
    },
    TIMEOUT,
  )

  it(
    'Correctly saves simple csv output',
    async () => {
      await suite(
        'Example 15',

        add('First', () => {
          return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          return () => [1, 2].reduce((a, b) => a + b)
        }),

        save({ format: 'csv' }),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content: CSVContent = await csvReader().fromFile(
        `benchmark/results/${file}`,
      )

      expect(content.length).toEqual(2)

      expect(content[0].name).toEqual('First')
      expect(content[0]).toHaveProperty('ops')
      expect(content[0]).toHaveProperty('margin')
      expect(content[0]).toHaveProperty('percentSlower')

      expect(content[1].name).toEqual('Second')
      expect(content[1]).toHaveProperty('ops')
      expect(content[1]).toHaveProperty('margin')
      expect(content[1]).toHaveProperty('percentSlower')
    },
    TIMEOUT,
  )

  it(
    'Correctly saves detailed csv output',
    async () => {
      await suite(
        'Example 16',

        add('First', () => {
          return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
        }),

        add('Second', () => {
          return () => [1, 2].reduce((a, b) => a + b)
        }),

        save({ format: 'csv', details: true }),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content: CSVContent = await csvReader().fromFile(
        `benchmark/results/${file}`,
      )

      expect(content.length).toEqual(2)

      expect(content[0].name).toEqual('First')
      expect(content[0]).toHaveProperty('ops')
      expect(content[0]).toHaveProperty('margin')
      expect(content[0]).toHaveProperty('percentSlower')
      expect(content[0]).toHaveProperty('samples')
      expect(content[0]).toHaveProperty('promise')
      expect(content[0]).toHaveProperty('min')
      expect(content[0]).toHaveProperty('max')
      expect(content[0]).toHaveProperty('mean')
      expect(content[0]).toHaveProperty('median')
      expect(content[0]).toHaveProperty('standardDeviation')
      expect(content[0]).toHaveProperty('marginOfError')
      expect(content[0]).toHaveProperty('relativeMarginOfError')
      expect(content[0]).toHaveProperty('standardErrorOfMean')
      expect(content[0]).toHaveProperty('sampleVariance')

      expect(content[1].name).toEqual('Second')
      expect(content[1]).toHaveProperty('ops')
      expect(content[1]).toHaveProperty('margin')
      expect(content[1]).toHaveProperty('percentSlower')
      expect(content[1]).toHaveProperty('samples')
      expect(content[1]).toHaveProperty('promise')
      expect(content[1]).toHaveProperty('min')
      expect(content[1]).toHaveProperty('max')
      expect(content[1]).toHaveProperty('mean')
      expect(content[1]).toHaveProperty('median')
      expect(content[1]).toHaveProperty('standardDeviation')
      expect(content[1]).toHaveProperty('marginOfError')
      expect(content[1]).toHaveProperty('relativeMarginOfError')
      expect(content[1]).toHaveProperty('standardErrorOfMean')
      expect(content[1]).toHaveProperty('sampleVariance')
    },
    TIMEOUT,
  )

  it(
    'Correctly saves simple html table',
    async () => {
      await suite(
        'Example 17',

        add(
          'First',
          () => {
            return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
          },
          { maxTime: 0.01 },
        ),

        add(
          'Second',
          () => {
            return () => [1, 2].reduce((a, b) => a + b)
          },
          { maxTime: 0.01 },
        ),

        save({ format: 'table.html' }),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = fs.readFileSync(`benchmark/results/${file}`).toString()

      const { document } = new JSDOM(content).window

      expect(document.title).toEqual('Example 17')
      expect(document.querySelectorAll('tr').length).toEqual(3)
      expect(document.querySelectorAll('th').length).toEqual(4)
      expect(document.querySelectorAll('td').length).toEqual(4 * 2)
    },
    TIMEOUT,
  )

  it(
    'Correctly saves detailed html table',
    async () => {
      await suite(
        'Example 18',

        add(
          'First',
          () => {
            return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
          },
          { maxTime: 0.01 },
        ),

        add(
          'Second',
          () => {
            return () => [1, 2].reduce((a, b) => a + b)
          },
          { maxTime: 0.01 },
        ),

        save({ format: 'table.html', details: true }),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = fs.readFileSync(`benchmark/results/${file}`).toString()

      const { document } = new JSDOM(content).window

      expect(document.title).toEqual('Example 18')
      expect(document.querySelectorAll('tr').length).toEqual(3)
      expect(document.querySelectorAll('th').length).toEqual(15)
      expect(document.querySelectorAll('td').length).toEqual(15 * 2)
    },
    TIMEOUT,
  )

  it(
    'Correctly saves html chart',
    async () => {
      await suite(
        'Example 19',

        add(
          'First',
          () => {
            return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
          },
          { maxTime: 0.01 },
        ),

        add(
          'Second',
          () => {
            return () => [1, 2].reduce((a, b) => a + b)
          },
          { maxTime: 0.01 },
        ),

        save({ format: 'chart.html' }),
      )

      await delay(1000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = fs.readFileSync(`benchmark/results/${file}`).toString()

      const { document } = new JSDOM(content).window

      const chart = document.querySelector('canvas')

      expect(document.title).toEqual('Example 19')
      expect(chart).not.toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Rounds results to smallest distinctive precision',
    async () => {
      const summary = await suite(
        'Example 20',

        add('Slow case - less ops', () => {
          return () => delay(500)
        }),

        add('Slow case - middle ops', () => {
          return () => delay(495)
        }),

        add('Slow case - more ops', () => {
          return () => delay(490)
        }),

        cycle(),
        complete(),
      )

      const resultAOps = summary.results[0].ops
      const resultBOps = summary.results[1].ops
      const resultCOps = summary.results[2].ops

      expect(resultBOps).toBeGreaterThan(resultAOps)
      expect(resultCOps).toBeGreaterThan(resultBOps)
    },
    TIMEOUT,
  )

  it(
    'Works with `configure` method - custom precision',
    async () => {
      const summary = await suite(
        'Example 21',

        add('Example', () => {
          ;[1, 2].reduce((a, b) => a + b)
        }),

        configure({ minDisplayPrecision: 3 }),
        cycle(),
        complete(),
      )

      const { results, date } = summary

      expect(date).toBeInstanceOf(Date)
      expect(results).toBeInstanceOf(Array)
      expect(results.length).toEqual(1)

      const [_, fraction] = String(results[0].ops).split('.')

      expect(typeof results[0].ops).toEqual('number')
      expect(fraction.length).toEqual(3)
      expect(results[0].name).toEqual('Example')
      expect(results[0].promise).toEqual(false)
      expect(typeof results[0].samples).toEqual('number')
    },
    TIMEOUT,
  )

  it(
    'Works with `configure` method - general case options',
    async () => {
      const summary = await suite(
        'Example 22',

        add(
          'Example',
          () => {
            ;[1, 2].reduce((a, b) => a + b)
          },
          { maxTime: 1, minSamples: 10 },
        ),

        configure({
          cases: {
            maxTime: 2,
            minSamples: 7,
            minTime: 0.7,
            delay: 0.1,
            initCount: 2,
          },
        }),

        cycle(),
        complete(),
      )

      const { results, date } = summary

      expect(date).toBeInstanceOf(Date)
      expect(results).toBeInstanceOf(Array)
      expect(results.length).toEqual(1)

      expect(typeof results[0].ops).toEqual('number')
      expect(results[0].name).toEqual('Example')
      expect(results[0].promise).toEqual(false)
      expect(typeof results[0].samples).toEqual('number')
      expect(results[0].options.delay).toEqual(0.1)
      expect(results[0].options.initCount).toEqual(2)
      expect(results[0].options.minTime).toEqual(0.7)
      expect(results[0].options.maxTime).toEqual(1)
      expect(results[0].options.minSamples).toEqual(10)
    },
    TIMEOUT,
  )
})
