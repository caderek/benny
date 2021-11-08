import { Event, Suite } from 'benchmark'
import * as kleur from 'kleur'
import * as logUpdate from 'log-update'
import { Summary, Config } from './internal/common-types'
import getSummary from './internal/getSummary'

type CompleteFn = (summary: Summary) => any

const defaultComplete: CompleteFn = (summary) => {
  const length = summary.results.length

  console.log(
    kleur.blue(`\nFinished ${length} case${length !== 1 ? 's' : ''}!`),
  )

  if (length > 1) {
    console.log(kleur.blue('  Fastest:'), summary.fastest.name)
    console.log(kleur.blue('  Slowest:'), summary.slowest.name)
  }
}

type Complete = (
  fn?: CompleteFn,
) => (config: Config) => Promise<(suiteObj: Suite) => Suite>

/**
 * Handles complete event
 */
const complete: Complete = (fn = defaultComplete) => async (config) => (
  suiteObj,
) => {
  logUpdate.done()
  suiteObj.on('complete', (event: Event) =>
    fn(getSummary(event, config.minDisplayPrecision ?? 0)),
  )
  return suiteObj
}

export { complete, Complete, CompleteFn }
export default complete
