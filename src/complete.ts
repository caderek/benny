import arr from '@arrows/array'
import { pipe } from '@arrows/composition'
import * as fs from 'fs'
import kleur = require('kleur')
import getEssentialResults from './internal/getEssentialResults'

const defaultComplete = (event) => {
  const results = getEssentialResults(event.currentTarget).sort(
    (a, b) => b.ops - a.ops,
  )
  const fastest = results[0]

  console.log(
    kleur.blue(`Finished ${results.length} cases, fastest: ${fastest.name}`),
  )
}

const complete = (fn = defaultComplete) => (suiteObj) => {
  suiteObj.on('complete', fn)
  return suiteObj
}

export { complete }
export default complete
