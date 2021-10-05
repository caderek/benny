import isNode from './isNode'
import runningStats from '../stats/runningStats'

const identity = (a: number) => a

const noopNode = () => {
  const rs = runningStats()

  let stats = { n: 0, mean: 0, margin: Infinity }

  let n = 0

  while (stats.margin > 0.1 || stats.n < 1e6) {
    const arg = Math.random()
    const t0 = process.hrtime.bigint()
    const result = identity(arg)
    const t1 = process.hrtime.bigint()
    stats = rs(Number(t1 - t0))

    n += result
  }

  if (n <= 0) {
    throw 'Noop initializing error'
  }

  return {
    val: BigInt(Math.round(stats.mean)),
    boundary: stats.mean * (stats.margin / 100),
    margin: stats.margin,
  }
}

const noopBrowser = () => {
  const rs = runningStats()

  let stats = { n: 0, mean: 0, margin: Infinity }

  let n = 0

  while (stats.margin > 1 || stats.n < 1e6) {
    const arg = Math.random()
    const t0 = performance.now()
    const result = identity(arg)
    const t1 = performance.now()
    stats = rs(t1 - t0)

    n += result
  }

  if (n <= 0) {
    throw 'Noop initializing error'
  }

  return {
    val: stats.mean,
    boundary: stats.mean * (stats.margin / 100),
    margin: stats.margin,
  }
}

const noop = isNode ? noopNode() : noopBrowser()

export default noop
