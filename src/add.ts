const add = (caseName, test) => {
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

export default add
