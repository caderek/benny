import { Event } from 'benchmark'
import { CaseResult } from './common-types'

type GetCaseResult = (event: Event) => CaseResult

const getCaseResult: GetCaseResult = (event) => {
  const target = event.target || event

  return {
    name: target.name,
    ops: Math.round(target.hz),
    margin: Number(target.stats.rme.toFixed(2)),
    options: {
      delay: target.delay,
      initCount: target.initCount,
      minTime: target.minTime,
      maxTime: target.maxTime,
      minSamples: target.minSamples,
    },
    samples: target.stats.sample.length,
    promise: target.defer,
  }
}

export default getCaseResult
