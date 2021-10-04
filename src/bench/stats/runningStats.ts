import tTable from './tTable'

const addToMean = (mean: number, n: number, newValue: number) => {
  return mean + (newValue - mean) / (n + 1)
}

const runningStats = () => {
  let n = 0
  let sum = 0
  let sumOfSquares = 0
  let mean = 0

  return (num: number) => {
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

export default runningStats
