import { Event, Suite } from 'benchmark'
import * as kleur from 'kleur'
import * as logUpdate from 'log-update'
import {
  CaseResult,
  CaseResultWithDiff,
  Summary,
  Config,
} from './internal/common-types'
import format from './internal/format'
import getCaseResult from './internal/getCaseResult'
import getSummary from './internal/getSummary'

type GetStatus = (
  item: CaseResultWithDiff,
  index: number,
  summary: Summary,
  ops: string,
  longestOps: string,
) => string

const getStatus: GetStatus = (item, index, summary, ops, longestOps) => {
  const isFastest = index === summary.fastest.index
  const isSlowest = index === summary.slowest.index
  const statusShift = longestOps.length - ops.length + 2

  return (
    ' '.repeat(statusShift) +
    (isFastest
      ? kleur.green('| fastest')
      : isSlowest
      ? kleur.red(`| slowest, ${item.percentSlower}% slower`)
      : kleur.yellow(`| ${item.percentSlower}% slower`))
  )
}

type CycleFn = (result: CaseResult, summary: Summary) => any

const defaultCycle: CycleFn = (_, summary) => {
  const allCompleted = summary.results.every((item) => item.samples > 0)
  const formatOps = summary.results.map((item) => format(item.ops))

  // copy and sort the array
  const longestOps = formatOps.slice().sort((a, b) => b.length - a.length)[0]

  const progress = Math.round(
    (summary.results.filter((result) => result.samples !== 0).length /
      summary.results.length) *
      100,
  )

  const progressInfo = `Progress: ${progress}%`

  const output = summary.results
    .map((item, index) => {
      const ops = formatOps[index]
      const margin = item.margin.toFixed(2)

      return item.samples
        ? kleur.cyan(`\n  ${item.name}:\n`) +
            `    ${ops} ops/s, ±${margin}% ${
              allCompleted
                ? getStatus(item, index, summary, ops, longestOps)
                : ''
            }`
        : null
    })
    .filter((item) => item !== null)
    .join('\n')

  return `${progressInfo}\n${output}`
}

type Cycle = (
  fn?: CycleFn,
) => (config: Config) => Promise<(suiteObj: Suite) => Suite>

/**
 * Handles complete events of each case
 */
const cycle: Cycle = (fn = defaultCycle) => async (config) => (suiteObj) => {
  suiteObj.on('cycle', (event: Event) => {
    const summary = getSummary(event, config.minDisplayPrecision ?? 0)
    const current = getCaseResult(event)
    const output = fn(current, summary)

    if (output) {
      logUpdate(output)
    }
  })
  return suiteObj
}

export { cycle, Cycle }
export default cycle
