import { Suite } from './internal/common-types'

type Run = (options?: object) => (suiteObj: Suite) => Suite

const run: Run = (options = {}) => (suiteObj) => {
  suiteObj.run({ async: true, ...options })
  return suiteObj
}

export { run, Run }
export default run
