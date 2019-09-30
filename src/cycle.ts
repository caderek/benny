import { Suite } from 'benchmark'
import * as kleur from 'kleur'
import { CaseResult } from './internal/common-types'
import format from './internal/format'
import getCaseResult from './internal/getCaseResult'

type CycleFn = (result: CaseResult) => any

const defaultCycle: CycleFn = (result) => {
  const ops = format(result.ops)
  const margin = result.margin.toFixed(2)

  console.log(kleur.green(`  ${result.name}:`)) // tslint:disable-line
  console.log(`    ${ops} ops/s, ±${margin}%`) // tslint:disable-line
}

type Cycle = (fn?: CycleFn) => Promise<(suiteObj: Suite) => Suite>

/**
 * Handles complete events of each case
 */
const cycle: Cycle = async (fn = defaultCycle) => (suiteObj) => {
  suiteObj.on('cycle', (event) => fn(getCaseResult(event)))
  return suiteObj
}

export { cycle, Cycle }
export default cycle
