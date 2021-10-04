const tTable = [
  2.326, 31.821, 6.965, 4.541, 3.747, 3.365, 3.143, 2.998, 2.896, 2.821, 2.764,
  2.718, 2.681, 2.65, 2.624, 2.602, 2.583, 2.567, 2.552, 2.539, 2.528, 2.518,
  2.508, 2.5, 2.492, 2.485, 2.479, 2.473, 2.467, 2.462, 2.457, 2.453, 2.449,
  2.445, 2.441, 2.438, 2.434, 2.431, 2.429, 2.426, 2.423, 2.421, 2.418, 2.416,
  2.414, 2.412, 2.41, 2.408, 2.407, 2.405, 2.403, 2.402, 2.4, 2.399, 2.397,
  2.396, 2.395, 2.394, 2.392, 2.391, 2.39, 2.389, 2.388, 2.387, 2.386, 2.385,
  2.384, 2.383, 2.382, 2.382, 2.381, 2.38, 2.379, 2.379, 2.378, 2.377, 2.376,
  2.376, 2.375, 2.374, 2.374, 2.373, 2.373, 2.372, 2.372, 2.371, 2.37, 2.37,
  2.369, 2.369, 2.368, 2.368, 2.368, 2.367, 2.367, 2.366, 2.366, 2.365, 2.365,
  2.365, 2.364,
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

const round = (n) => {
  if (n === 0) {
    return 0
  }

  const [whole, fraction] = String(n).split('.')
  const x = n >= 1 ? -(whole.length - 1) : fraction.match(/[1-9]/).index + 1
  return Math.round(n * 10 ** x) / 10 ** x
}

const detect = () => {
  const getSample = () => {
    const t0 = performance.now()
    while (true) {
      const t1 = performance.now()
      if (t0 !== t1) {
        return t1 - t0
      }
    }
  }

  const rs = runningStats()

  let stats = { n: 0, mean: 0, margin: Infinity }

  while (stats.margin > 1 || stats.n < 100) {
    stats = rs(getSample())
  }

  return round(stats.mean)
}

const detectNode = () => {
  const getSample = () => {
    const t0 = process.hrtime.bigint()
    while (true) {
      const t1 = process.hrtime.bigint()
      if (t0 !== t1) {
        return Number(t1 - t0)
      }
    }
  }

  const rs = runningStats()

  let stats = { n: 0, mean: 0, margin: Infinity }

  while (stats.margin > 1 || stats.n < 100) {
    stats = rs(getSample())
  }

  return round(stats.mean)
}

console.log(detectNode())
