import runningStats from '../stats/runningStats'
import isNode from './isNode'

const round = (n: number) => {
  if (n === 0) {
    return 0
  }

  const [whole, fraction] = String(n).split('.')
  const x =
    n >= 1 ? -(whole.length - 1) : Number(fraction.match(/[1-9]/)?.index) + 1
  return Math.round(n * 10 ** x) / 10 ** x
}

const getNodeSample = () => {
  const t0 = process.hrtime.bigint()
  while (true) {
    const t1 = process.hrtime.bigint()
    if (t0 !== t1) {
      return Number(t1 - t0)
    }
  }
}

const getBrowserSample = () => {
  const t0 = performance.now()
  while (true) {
    const t1 = performance.now()
    if (t0 !== t1) {
      return t1 - t0
    }
  }
}

const detectTimerResolution = () => {
  const getSample = isNode ? getNodeSample : getBrowserSample

  const rs = runningStats()

  let stats = { n: 0, mean: 0, margin: Infinity }

  while (stats.margin > 1 || stats.n < 1e3) {
    stats = rs(getSample())
  }

  return round(stats.mean)
}

export default detectTimerResolution
