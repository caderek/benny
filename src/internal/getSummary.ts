import { Event } from 'benchmark'
import { Summary } from './common-types'
import getCaseResult from './getCaseResult'

type GetSummary = (event: Event) => Summary

const getSummary: GetSummary = (event) => {
  const results = Object.entries(event.currentTarget)
    .filter(([key]) => !Number.isNaN(Number(key)))
    .map(([_, target]) => getCaseResult(target))

  const fastestIndex = results.reduce(
    (prev, next, index) => {
      return next.ops > prev.ops ? { ops: next.ops, index } : prev
    },
    { ops: 0, index: null },
  ).index

  const slowestIndex = results.reduce(
    (prev, next, index) => {
      return next.ops < prev.ops ? { ops: next.ops, index } : prev
    },
    { ops: Infinity, index: null },
  ).index

  const resultsWithDiffs = results.map((result, index) => {
    const percentSlower =
      index === fastestIndex
        ? 0
        : Number(
            ((1 - result.ops / results[fastestIndex].ops) * 100).toFixed(2),
          )

    return { ...result, percentSlower }
  })

  return {
    name: event.currentTarget.name,
    date: new Date(event.timeStamp),
    results: resultsWithDiffs,
    fastest: {
      name: results[fastestIndex].name,
      index: fastestIndex,
    },
    slowest: {
      name: results[slowestIndex].name,
      index: slowestIndex,
    },
  }
}

export default getSummary
