import * as kleur from 'kleur'
import format from './internal/format'

const defaultCycle = ({ target }) => {
  const hz = format(Math.round(target.hz))
  const rme = target.stats.rme.toFixed(2)

  console.log(kleur.green(`${target.name}:`)) // tslint:disable-line
  console.log(`  ${hz} ops/s, ±${rme}%`) // tslint:disable-line
}

const cycle = (fn = defaultCycle) => (suiteObj) => {
  suiteObj.on('cycle', fn)
  return suiteObj
}

export { cycle }
export default cycle
