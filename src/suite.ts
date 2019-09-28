import { pipe } from '@arrows/composition'
import * as Benchmark from 'benchmark'
import kleur = require('kleur')
import { SkipResult } from './add'
import { Suite } from './internal/common-types'

type PartialMethod =
  | ((suiteObj: Suite) => Suite)
  | SkipResult
  | ((suiteObj: Suite) => Promise<Event>)

type SuiteFn = (name: string, ...fns: PartialMethod[]) => Promise<Event>

const suite: SuiteFn = (name, ...fns) => {
  const suiteObj = new Benchmark.Suite(name).on('start', () => {
    console.log(kleur.yellow(`Running "${name}" suite...`))
  })

  const hasOnly = fns.filter((fn) => fn.name === 'only').length > 0
  const items = hasOnly
    ? fns.filter((fn) => fn.name !== 'add' && fn.name !== 'skip')
    : fns.filter((fn) => fn.name !== 'skip')

  return new Promise((resolve, reject) => {
    // @ts-ignore
    pipe(...items)(suiteObj)
      .on('complete', resolve)
      .on('error', reject)
      .run()
  })
}

export { suite }
export default suite
