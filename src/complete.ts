import { Event, Suite } from 'benchmark'
import kleur = require('kleur')
import getEssentialResults from './internal/getEssentialResults'

type CompleteFn = (event: Event) => any

const defaultComplete: CompleteFn = (event) => {
  const results = getEssentialResults(event.currentTarget).sort(
    (a, b) => b.ops - a.ops,
  )
  const fastest = results[0]

  console.log(
    kleur.blue(`Finished ${results.length} cases, fastest: ${fastest.name}`),
  )
}

type Complete = (fn?: CompleteFn) => (suiteObj: Suite) => Suite

/**
 * Handles complete event
 */
const complete: Complete = (fn = defaultComplete) => (suiteObj) => {
  suiteObj.on('complete', fn)
  return suiteObj
}

export { complete, Complete }
export default complete
