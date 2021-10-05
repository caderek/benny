import isNode from './isNode'
import { Test } from '../../internal/common-types'
import detectTimerResolution from './detectTimerResolution'
import noop from './noop'

const measureNode = (test: Test) => {
  const t0 = process.hrtime.bigint()
  test()
  const t1 = process.hrtime.bigint()
  return Number(t1 - t0 - (noop.val as bigint))
}

const measureBrowser = (test: Test) => {
  const t0 = performance.now()
  test()
  const t1 = performance.now()
  return t1 - t0 - (noop.val as number)
}

const getTimer = () => {
  const resolution = detectTimerResolution()

  if (isNode) {
    let start: bigint

    return {
      measure: measureNode,
      init() {
        start = process.hrtime.bigint()
      },
      since() {
        return Number(process.hrtime.bigint() - start) / 1e9
      },
      resolution,
    }
  }

  let start: number

  return {
    measure: measureBrowser,
    init() {
      start = performance.now()
    },
    since() {
      return (performance.now() - start) / 1e3
    },
    resolution,
  }
}

export default getTimer()
