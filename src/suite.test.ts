import * as fs from 'fs-extra'
import { add, complete, cycle, save, suite } from './index'
import { CaseResult, Summary } from './internal/common-types'

const TIMEOUT = 30000

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('suite', () => {
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
    'Works with custom options',
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
      expect(content.version).toEqual('1.2.3')
    },
    TIMEOUT,
  )

  it(
    'Returns a Promise with the array of results - default options',
    async () => {
      const summary = await suite(
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
    'Returns a Promise with the array of results - custom options',
    async () => {
      const summary = await suite(
        'Example 6',

        add(
          'First',
          () => {
            ;[1, 2].reduce((a, b) => a + b)
          },
          {
            delay: 0.01,
            initCount: 2,
            maxTime: 4,
            minSamples: 4,
            minTime: 0.06,
          },
        ),

        add(
          'Second',
          () => {
            ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
          },
          {
            delay: 0.02,
            initCount: 3,
            maxTime: 3,
            minSamples: 6,
            minTime: 0.07,
          },
        ),

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
      expect(results[0].options.delay).toEqual(0.01)
      expect(results[0].options.initCount).toEqual(2)
      expect(results[0].options.minTime).toEqual(0.06)
      expect(results[0].options.maxTime).toEqual(4)
      expect(results[0].options.minSamples).toEqual(4)

      expect(typeof results[1].ops).toEqual('number')
      expect(results[1].name).toEqual('Second')
      expect(results[1].promise).toEqual(false)
      expect(typeof results[1].samples).toEqual('number')
      expect(results[1].options.delay).toEqual(0.02)
      expect(results[1].options.initCount).toEqual(3)
      expect(results[1].options.minTime).toEqual(0.07)
      expect(results[1].options.maxTime).toEqual(3)
      expect(results[1].options.minSamples).toEqual(6)
    },
    TIMEOUT,
  )

  it(
    'Cycle functions receives current case result',
    async () => {
      try {
        const result: CaseResult = await new Promise((resolve) => {
          suite(
            'Example 6',

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
          'Example 6',

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
})
