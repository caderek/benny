import { getType, types } from '@arrows/dispatch'
import { Suite } from 'benchmark'

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

const prepareCaseFn = async (test) => {
  const returnType = getType(test())

  if (returnType === types.Function && getType(test()()) === types.Promise) {
    return {
      rawTest: (deferred) => test()().then(() => deferred.resolve()),
      defer: true,
    }
  }

  if (returnType === types.Function) {
    return {
      rawTest: test(),
      defer: false,
    }
  }

  if (returnType === types.Promise) {
    const promiseContent = await test()

    if (
      [types.Function, types.AsyncFunction].includes(getType(promiseContent))
    ) {
      const nestedReturnType = promiseContent()

      if (getType(nestedReturnType) === types.Promise) {
        return {
          rawTest: (deferred) =>
            promiseContent().then(() => deferred.resolve()),
          defer: true,
        }
      } else {
        return {
          rawTest: promiseContent,
          defer: false,
        }
      }
    }

    return {
      rawTest: (deferred) => test().then(() => deferred.resolve()),
      defer: true,
    }
  }

  return {
    rawTest: test,
    defer: false,
  }
}

type Add = {
  (caseName: string, test: Test, options?: Options): Promise<
    (suiteObj: Suite) => Suite
  >
  only: (
    caseName: string,
    test: Test,
    options?: Options,
  ) => Promise<(suiteObj: Suite) => Suite>
  skip: (...args: any[]) => Promise<SkipResult>
}

/**
 * Adds a benchmark case
 */
const add: Add = async (caseName, test, options = {}) => {
  const { rawTest, defer } = await prepareCaseFn(test)

  const fn = (suiteObj) => {
    suiteObj.add(caseName, rawTest, { ...options, defer })
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'add' })

  return fn
}

add.only = async (caseName, test, options = {}) => {
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

add.skip = (...args) => Promise.resolve({ name: 'skip' })

export { add, Add, SkipResult }
export default add
