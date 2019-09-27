const run = (options = {}) => (suiteObj) => {
  suiteObj.run({ async: true, ...options })
}

export { run }
export default run
