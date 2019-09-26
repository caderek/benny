import { pipe } from '@arrows/composition'
import * as Benchmark from 'benchmark'

const suite = (...fns) => {
  const hasOnly = fns.filter((fn) => fn.name === 'only').length > 0
  const items = hasOnly
    ? fns.filter((fn) => fn.name !== 'add' && fn.name !== 'skip')
    : fns.filter((fn) => fn.name !== 'skip')

  pipe(...items)(new Benchmark.Suite())
}

export { suite }
export default suite
