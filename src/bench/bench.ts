import runningStats from './stats/runningStats'
import {
  Test,
  BenchmarkOptions,
  FullBenchmarkOptions,
  BenchmarkResult,
} from '../internal/common-types'
import { RSA_NO_PADDING } from 'constants'

const MIN_USEFUL_SAMPLES = 2

const defaultOptions: BenchmarkOptions = {
  minSamples: 1000,
  minTime: 5000000000n,
  maxTime: 300000000000n,
  maxMargin: 1,
}

const measureNode = (test: Test) => {
  const t0 = process.hrtime.bigint()
  test()
  const t1 = process.hrtime.bigint()
  return Number(t1 - t0)
}

const measureBrowser = (test: Test) => {
  const t0 = performance.now()
  test()
  const t1 = performance.now()
  return (t1 - t0) * 1000000
}

const detect = () => {
  const getSample = () => {
    const t0 = performance.now()
    while (true) {
      const t1 = performance.now()
      if (t0 !== t1) {
        return Number(t1 - t0)
      }
    }
  }

  const rs = runningStats()

  let stats = { n: 0, mean: 0, margin: Infinity }

  while (stats.margin > 1 || stats.n < 100) {
    rs(getSample())
  }

  return stats
}

const detectTimerResolution = () => {
  const getSample = () => {
    const t0 = performance.now()
    while (true) {
      const t1 = performance.now()
      if (t0 !== t1) {
        return t1 - t0
      }
    }
  }

  let samples = []

  for (let i = 0; i < 1000; i++) {
    samples.push(getSample())
  }

  samples.sort((a, b) => a - b)

  const median = (samples[499] + samples[500]) / 2

  return median
}

const detectNodeTimerResolution = () => {
  const getSample = () => {
    const t0 = process.hrtime.bigint()
    while (true) {
      const t1 = process.hrtime.bigint()
      if (t0 !== t1) {
        return t1 - t0
      }
    }
  }

  let samples = []

  for (let i = 0; i < 1000; i++) {
    samples.push(getSample())
  }

  samples.sort((a, b) => (a > b ? 1 : -1))

  const median = (samples[499] + samples[500]) / 2n

  return median
}

const getTimer = () => {
  const isNode = typeof process !== 'undefined'
  const isModernBrowser = typeof performance !== 'undefined'

  if (isNode) {
    if (process?.hrtime?.bigint) {
      return {
        measure: measureNode,
        sec: process.hrtime.bigint,
        since(start: bigint) {
          return this.sec() - start
        },
        isNode,
      }
    }

    throw new Error('Unsupported Node version (< v10.7.0)')
  }

  if (isModernBrowser) {
    return {
      measure: measureBrowser,
      now: performance.now.bind(performance),
      since(start: number) {
        return this.now() - start
      },
      isNode,
    }
  }

  throw new Error('Unsupported browser')
}

const timer = getTimer()

const bench = async (
  name: string,
  test: Test,
  options: BenchmarkOptions = {},
): Promise<BenchmarkResult> => {
  const rs = runningStats()
  const opt = { ...defaultOptions, ...options } as FullBenchmarkOptions

  let stats = { n: 0, mean: 0, margin: Infinity }
  let benchStart = timer.now()
  let benchTime = 0n

  while (true) {
    benchTime = timer.since(benchStart)

    if (
      (benchTime > opt.maxTime ||
        (benchTime > opt.minTime &&
          stats.n >= opt.minSamples &&
          stats.margin < opt.maxMargin &&
          stats.n >= MIN_USEFUL_SAMPLES)) &&
      stats.n >= MIN_USEFUL_SAMPLES
    ) {
      break
    }

    const time = timer.measure(test)
    stats = rs(Number(time))
  }

  return {
    name,
    stats: { ...stats, ops: 1000000000 / stats.mean },
    time: Number(benchTime / 1000000n) / 1000,
  }
}

export default bench
