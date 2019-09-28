import { Event, Suite } from 'benchmark'
import * as kleur from 'kleur'
import format from './internal/format'

type CycleFn = (event: Event) => any

const defaultCycle: CycleFn = ({ target }) => {
  const hz = format(Math.round(target.hz))
  const rme = target.stats.rme.toFixed(2)

  console.log(kleur.green(`  ${target.name}:`)) // tslint:disable-line
  console.log(`    ${hz} ops/s, ±${rme}%`) // tslint:disable-line
}

type Cycle = (fn?: CycleFn) => (suiteObj: Suite) => Suite

/**
 * Handles complete events of each case
 */
const cycle: Cycle = (fn = defaultCycle) => (suiteObj) => {
  suiteObj.on('cycle', fn)
  return suiteObj
}

export { cycle, Cycle }
export default cycle
