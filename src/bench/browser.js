const tTable = [
  2.326,
  31.821,
  6.965,
  4.541,
  3.747,
  3.365,
  3.143,
  2.998,
  2.896,
  2.821,
  2.764,
  2.718,
  2.681,
  2.65,
  2.624,
  2.602,
  2.583,
  2.567,
  2.552,
  2.539,
  2.528,
  2.518,
  2.508,
  2.5,
  2.492,
  2.485,
  2.479,
  2.473,
  2.467,
  2.462,
  2.457,
  2.453,
  2.449,
  2.445,
  2.441,
  2.438,
  2.434,
  2.431,
  2.429,
  2.426,
  2.423,
  2.421,
  2.418,
  2.416,
  2.414,
  2.412,
  2.41,
  2.408,
  2.407,
  2.405,
  2.403,
  2.402,
  2.4,
  2.399,
  2.397,
  2.396,
  2.395,
  2.394,
  2.392,
  2.391,
  2.39,
  2.389,
  2.388,
  2.387,
  2.386,
  2.385,
  2.384,
  2.383,
  2.382,
  2.382,
  2.381,
  2.38,
  2.379,
  2.379,
  2.378,
  2.377,
  2.376,
  2.376,
  2.375,
  2.374,
  2.374,
  2.373,
  2.373,
  2.372,
  2.372,
  2.371,
  2.37,
  2.37,
  2.369,
  2.369,
  2.368,
  2.368,
  2.368,
  2.367,
  2.367,
  2.366,
  2.366,
  2.365,
  2.365,
  2.365,
  2.364,
]

const addToMean = (mean, n, newValue) => {
  return mean + (newValue - mean) / (n + 1)
}

const runningStats = () => {
  let n = 0
  let sum = 0
  let sumOfSquares = 0
  let mean = 0

  return (num) => {
    n++

    mean = n === 1 ? num : addToMean(mean, n, num)
    sum += num
    sumOfSquares += num ** 2

    const standardDeviation = Math.sqrt(sumOfSquares / n - Math.pow(sum / n, 2))
    const standardErrorOfMean = standardDeviation / Math.sqrt(n)
    const critical = tTable[n - 1 || 1] || tTable[0]
    const marginOfError = standardErrorOfMean * critical
    const relativeMarginOfError = (marginOfError / mean) * 100 || 0

    return {
      n,
      mean,
      margin: relativeMarginOfError,
    }
  }
}

const MIN_USEFUL_SAMPLES = 2

const defaultOptions = {
  minSamples: 1000,
  minTime: 5000000000n,
  maxTime: 300000000000n,
  maxMargin: 1,
}

const measureNode = (test) => {
  const t0 = process.hrtime.bigint()
  test()
  const t1 = process.hrtime.bigint()
  return Number(t1 - t0)
}

const measureBrowser = (test) => {
  const t0 = performance.now()
  test()
  const t1 = performance.now()
  return (t1 - t0) * 1e6
}

const getTimer = () => {
  const isNode = typeof process !== "undefined"
  const isModernBrowser = typeof performance !== "undefined"

  if (isNode) {
    if (process?.hrtime?.bigint) {
      return {
        measure: measureNode,
        now: process.hrtime.bigint,
        isNode,
      }
    }

    throw new Error("Unsupported Node version (< v10.7.0)")
  }

  if (isModernBrowser) {
    return {
      measure: measureBrowser,
      now: () => BigInt(Math.round(performance.now() * 1e6)),
      isNode,
    }
  }

  throw new Error("Unsupported browser")
}

const timer = getTimer()

const bench = async (name, test, options = {}) => {
  const rs = runningStats()
  const opt = { ...defaultOptions, ...options }
  const base = () => {}

  let stats = { n: 0, mean: 0, margin: Infinity }
  let benchStart = timer.now()
  let benchTime = 0n

  while (true) {
    benchTime = timer.now() - benchStart

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

const format = (num) => {
  const [whole, fraction] = String(num).split(".")
  const chunked = []

  whole
    .split("")
    .reverse()
    .forEach((char, index) => {
      if (index % 3 === 0) {
        chunked.unshift([char])
      } else {
        chunked[0].unshift(char)
      }
    })

  return (
    chunked.map((chunk) => chunk.join("")).join(" ") +
    (fraction ? `.${fraction}` : "")
  )
}

const display = ({ name, stats, time }) => {
  console.log(`Custom - ${name}:`)
  console.log(
    `${format(stats.ops.toFixed(2))} ops/s ±${stats.margin.toFixed(
      2,
    )}% (${format(stats.n)} samples in ${time}s)\n`,
  )
}

const main = async () => {
  const data = new Array(1e3).fill(null).map((_, i) => i)

  const options = {
    minSamples: 1000,
    minTime: 5000000000n,
    maxTime: 30000000000n,
    maxMargin: 1,
  }

  await bench("empty", () => {}, options).then(display)

  await bench(
    "sum",
    () => {
      1 + 1
    },
    options,
  ).then(display)

  await bench(
    "sum 2 elements",
    () => {
      ;[1, 2].reduce((a, b) => a + b)
    },
    options,
  ).then(display)

  await bench(
    "sum 5 elements",
    () => {
      ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
    },
    options,
  ).then(display)

  await bench(
    `sum ${data.length} elements`,
    () => {
      data.reduce((a, b) => a + b)
    },
    options,
  ).then(display)
}

main()
