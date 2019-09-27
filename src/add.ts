import { Suite } from './internal/common-types'

type SkipResult = {
  name: 'skip'
}
type Test = () => any | Test
type Add = {
  (caseName: string, test: Test): (suiteObj: Suite) => Suite
  only: (caseName: string, test: Test) => (suiteObj: Suite) => Suite
  skip: (...args: any[]) => SkipResult
}

const add: Add = (caseName, test) => {
  const fn = (suiteObj) => {
    suiteObj.add(caseName, typeof test() === 'function' ? test() : test)
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'add' })

  return fn
}

add.only = (caseName, test) => {
  const fn = (suiteObj) => {
    suiteObj.add(caseName, typeof test() === 'function' ? test() : test)
    return suiteObj
  }

  Object.defineProperty(fn, 'name', { value: 'only' })

  return fn
}

add.skip = (...args) => ({ name: 'skip' })

export { add, Add, SkipResult }
export default add
