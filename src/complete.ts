import arr from '@arrows/array'
import { pipe } from '@arrows/composition'
import * as fs from 'fs'
import kleur = require('kleur')
import getEssentialResults from './internal/getEssentialResults'

const defaultComplete = (event) => {
  const results = arr._sortBy((result) => result.ops)((a, b) =>
    a < b ? 1 : 0,
  )(getEssentialResults(event.currentTarget))
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
