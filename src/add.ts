import { Suite } from './internal/common-types'

type Options = {
  /**
   * The delay between test cycles (secs).
   *
   * @default 0.005
   */
  delay?: number

  /**
   * The default number of times to execute a test on a benchmark's first cycle.
   *
   * @default 1
   */
  initCount?: number

  /**
   * The maximum time a benchmark is allowed to run before finishing (secs).
   *
   * Note: Cycle delays aren't counted toward the maximum time.
   *
   * @default 5
   */
  maxTime?: number

  /**
   * The minimum sample size required to perform statistical analysis.
   *
   * @default 5
   */
  minSamples?: number

  /**
   * The time needed to reduce the percent uncertainty of measurement to 1% (secs).
   *
   * @default 0
   */
  minTime?: number
}

type SkipResult = {
  name: 'skip'
}

type Test = () => any | Test

type Add = {
  (caseName: string, test: Test, options?: Options): (suiteObj: Suite) => Suite
  only: (
    caseName: string,
    test: Test,
    options?: Options,
  ) => (suiteObj: Suite) => Suite
  skip: (...args: any[]) => SkipResult
}

/**
 * Adds a benchmark case
 */
const add: Add = (caseName, test, options = {}) => {
  const fn = (suiteObj) => {
    suiteObj.add(
      caseName,
      typeof test() === 'function' ? test() : test,
      options,
    )
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'add' })

  return fn
}

add.only = (caseName, test, options = {}) => {
  const fn = (suiteObj) => {
    suiteObj.add(
      caseName,
      typeof test() === 'function' ? test() : test,
      options,
    )
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'only' })

  return fn
}

add.skip = (...args) => ({ name: 'skip' })

export { add, Add, SkipResult }
export default add
