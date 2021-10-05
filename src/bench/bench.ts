import runningStats from './stats/runningStats'
import timer from './tools/timer'
import {
  Test,
  BenchmarkOptions,
  FullBenchmarkOptions,
  BenchmarkResult,
} from '../internal/common-types'
import noop from './tools/noop'
import isNode from './tools/isNode'

const MIN_USEFUL_SAMPLES = 2

const defaultOptions: BenchmarkOptions = {
  minSamples: 1000,
  minTime: 5,
  maxTime: 30,
  maxMargin: 1,
}

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

  if (stats.mean <= noop.boundary) {
    stats.mean = 0
    stats.margin = Infinity
  }

  const ops = isNode ? 1000000000 / stats.mean : 1000 / stats.mean

  return {
    name,
    stats: { ...stats, ops },
    time: benchTime,
  }
}

export default bench
