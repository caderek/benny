import runningStats from './stats/runningStats'
import detectTimerResolution from './detectTimerResolution'
import {
  Test,
  BenchmarkOptions,
  FullBenchmarkOptions,
  BenchmarkResult,
} from '../internal/common-types'

const MIN_USEFUL_SAMPLES = 2

const defaultOptions: BenchmarkOptions = {
  minSamples: 1000,
  minTime: 5,
  maxTime: 30,
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
  return (t1 - t0) * 1e6
}

const getTimer = () => {
  const isNode = typeof process !== 'undefined'
  const isModernBrowser = typeof performance !== 'undefined'

  if (isNode) {
    if (process?.hrtime?.bigint) {
      let start: bigint

      return {
        measure: measureNode,
        init() {
          start = process.hrtime.bigint()
        },
        since() {
          return Number(process.hrtime.bigint() - start) / 1e9
        },
        resolution: detectTimerResolution(isNode),
        isNode,
      }
    }

    throw new Error('Unsupported Node version (< v10.7.0)')
  }

  if (isModernBrowser) {
    let start: number

    return {
      measure: measureBrowser,
      init() {
        start = performance.now()
      },
      since() {
        return (performance.now() - start) / 1e3
      },
      resolution: detectTimerResolution(isNode),
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
  let benchTime = 0

  timer.init()

  while (true) {
    benchTime = timer.since()

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

  console.log({ mean: stats.mean, res: timer.resolution })

  return {
    name,
    stats: { ...stats, ops: 1000000000 / stats.mean },
    time: benchTime,
  }
}

export default bench
