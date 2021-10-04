import runningStats from './stats/runningStats'

const round = (n: number) => {
  if (n === 0) {
    return 0
  }

  const [whole, fraction] = String(n).split('.')
  const x =
    n >= 1 ? -(whole.length - 1) : Number(fraction.match(/[1-9]/)?.index) + 1
  return Math.round(n * 10 ** x) / 10 ** x
}

const detectBrowserTimerResolution = () => {
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

  return round(stats.mean) * 1e6
}

const detectNodeTimerResolution = () => {
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

const detectTimerResolution = (isNode: boolean) =>
  isNode ? detectNodeTimerResolution() : detectBrowserTimerResolution()

export default detectTimerResolution
