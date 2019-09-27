import * as fs from 'fs-extra'
import { add, complete, cycle, run, save, suite } from './index'

const TIMEOUT = 30000

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('suite', () => {
  afterEach(() => {
    fs.removeSync('benchmark')
  })

  it(
    'Works with defaults and direct cases',
    async () => {
      await new Promise((resolve) => {
        suite(
          add('First', () => {
            ;[1, 2].reduce((a, b) => a + b)
          }),

          add('Second', () => {
            ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
          }),

          cycle(),
          complete(),
          save(),
          run(),
        ).on('complete', resolve)
      })

      await delay(2000)

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
      expect(typeof content.results[0].deviation).toEqual('number')
      expect(typeof content.results[1].deviation).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with defaults and cases returned in wrapping function',
    async () => {
      await new Promise((resolve) => {
        suite(
          add('First', () => {
            return () => [1, 2].reduce((a, b) => a + b)
          }),

          add('Second', () => {
            return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
          }),

          cycle(),
          complete(),
          save(),
          run(),
        ).on('complete', resolve)
      })

      await delay(2000)

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
      expect(typeof content.results[0].deviation).toEqual('number')
      expect(typeof content.results[1].deviation).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with .only and direct cases',
    async () => {
      await new Promise((resolve) => {
        suite(
          add.only('First', () => {
            ;[1, 2].reduce((a, b) => a + b)
          }),

          add('Second', () => {
            ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
          }),

          cycle(),
          complete(),
          save(),
          run(),
        ).on('complete', resolve)
      })

      await delay(2000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(1)
      expect(content.results[0].name).toEqual('First')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[0].deviation).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with .only and cases returned in wrapping function',
    async () => {
      await new Promise((resolve) => {
        suite(
          add.only('First', () => {
            return () => [1, 2, 3, 4, 5].reduce((a, b) => a + b)
          }),

          add('Second', () => {
            return () => [1, 2].reduce((a, b) => a + b)
          }),

          cycle(),
          complete(),
          save(),
          run(),
        ).on('complete', resolve)
      })

      await delay(2000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(1)
      expect(content.results[0].name).toEqual('First')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[0].deviation).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with .skip',
    async () => {
      await new Promise((resolve) => {
        suite(
          add.skip('First', () => {
            ;[1, 2].reduce((a, b) => a + b)
          }),

          add('Second', () => {
            ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
          }),

          cycle(),
          complete(),
          save(),
          run(),
        ).on('complete', resolve)
      })

      await delay(2000)

      const file = fs.readdirSync('benchmark/results')[0]

      const content = JSON.parse(
        fs.readFileSync(`benchmark/results/${file}`).toString(),
      )

      const date = new Date(content.date).toDateString()

      expect(date).not.toEqual('Invalid Date')
      expect(content.results.length).toEqual(1)
      expect(content.results[0].name).toEqual('Second')
      expect(typeof content.results[0].ops).toEqual('number')
      expect(typeof content.results[0].deviation).toEqual('number')
      expect(content.version).toEqual(null)
    },
    TIMEOUT,
  )

  it(
    'Works with custom options',
    async () => {
      await new Promise((resolve) => {
        suite(
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
          run(),
        ).on('complete', resolve)
      })

      await delay(2000)

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
      expect(typeof content.results[0].deviation).toEqual('number')
      expect(typeof content.results[1].deviation).toEqual('number')
      expect(content.version).toEqual('1.2.3')
    },
    TIMEOUT,
  )
})
