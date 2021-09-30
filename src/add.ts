import getType from '@arrows/dispatch/getType'
import types from '@arrows/dispatch/types'
import { Suite } from 'benchmark'
import { Options, Config } from './internal/common-types'

type SkipResult = {
  name: 'skip'
}

type Test = () => any | Test

type Deferred = {
  resolve(): void
}

const prepareCaseFn = async (test: Test) => {
  const returnType = getType(test())

  if (returnType === types.Function && getType(test()()) === types.Promise) {
    return {
      rawTest: (deferred: Deferred) => test()().then(() => deferred.resolve()),
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

    if (getType(promiseContent) === types.Function) {
      const nestedReturnType = promiseContent()

      if (getType(nestedReturnType) === types.Promise) {
        return {
          rawTest: (deferred: Deferred) =>
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
      rawTest: (deferred: Deferred) => test().then(() => deferred.resolve()),
      defer: true,
    }
  }

  return {
    rawTest: test,
    defer: false,
  }
}

type Add = {
  (caseName: string, test: Test, options?: Options): (
    config: Config,
  ) => Promise<(suiteObj: Suite) => Suite>

  only: (
    caseName: string,
    test: Test,
    options?: Options,
  ) => (config: Config) => Promise<(suiteObj: Suite) => Suite>
  skip: (...args: any[]) => SkipResult
}

/**
 * Adds a benchmark case
 */
const add: Add = (caseName, test, options = {}) => async (config) => {
  const { rawTest, defer } = await prepareCaseFn(test)

  const defaultOptions = config.cases ?? {}
  const cfg = { ...defaultOptions, ...options }

  const fn = (suiteObj: Suite) => {
    suiteObj.add(caseName, rawTest, { ...cfg, defer })
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'add' })

  return fn
}

add.only = (caseName, test, options = {}) => async (config) => {
  const { rawTest, defer } = await prepareCaseFn(test)

  const defaultOptions = config.cases ?? {}
  const cfg = { ...defaultOptions, ...options }

  const fn = (suiteObj: Suite) => {
    suiteObj.add(caseName, rawTest, { ...cfg, defer })
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'only' })

  return fn
}

add.skip = (...args) => ({ name: 'skip' })

export { add, Add, SkipResult }
export default add
