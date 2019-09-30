import { pipe } from '@arrows/composition'
import { Suite } from 'benchmark'
import kleur = require('kleur')
import { SkipResult } from './add'
import { Summary } from './internal/common-types'
import getSummary from './internal/getSummary'

type PartialMethod = Promise<((suiteObj: Suite) => Suite) | SkipResult>

type SuiteFn = (name: string, ...fns: PartialMethod[]) => Promise<Summary>

/**
 * Creates and runs benchmark suite
 */
const suite: SuiteFn = async (name, ...fns) => {
  const unpackedFns = await Promise.all([...fns])
  const suiteObj = new Suite(name).on('start', () => {
    console.log(kleur.yellow(`Running "${name}" suite...`))
  })

  const hasOnly = unpackedFns.filter((fn) => fn.name === 'only').length > 0
  const items = hasOnly
    ? unpackedFns.filter((fn) => fn.name !== 'add' && fn.name !== 'skip')
    : unpackedFns.filter((fn) => fn.name !== 'skip')

  return new Promise((resolve, reject) => {
    // @ts-ignore
    pipe(...items)(suiteObj)
      .on('complete', (event) => resolve(getSummary(event)))
      .on('error', reject)
      .run()
  })
}

export { suite }
export default suite
