const run = (options = {}) => (suiteObj) => {
  suiteObj.run({ async: true, ...options })
  return suiteObj
}

export { run }
export default run
