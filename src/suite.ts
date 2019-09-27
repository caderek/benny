import { pipe } from '@arrows/composition'
import * as Benchmark from 'benchmark'
import { Add, SkipResult } from './add'
import { Complete } from './complete'
import { Cycle } from './cycle'
import { Suite } from './internal/common-types'
import { Run } from './run'
import { Save } from './save'

type PartialMethods = ((suiteObj: Suite) => Suite) | SkipResult

type SuiteFn = (...fns: PartialMethods[]) => Suite

const suite: SuiteFn = (...fns) => {
  const hasOnly = fns.filter((fn) => fn.name === 'only').length > 0
  const items = hasOnly
    ? fns.filter((fn) => fn.name !== 'add' && fn.name !== 'skip')
    : fns.filter((fn) => fn.name !== 'skip')

  // @ts-ignore
  return pipe(...items)(new Benchmark.Suite())
}

export { suite }
export default suite
