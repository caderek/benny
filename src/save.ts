import * as fs from 'fs-extra'
import * as path from 'path'
import getEssentialResults from './internal/getEssentialResults'

const defaultOptions = {
  file: ({ timeStamp }) => {
    const version = defaultOptions.version ? `${defaultOptions.version}-` : ''
    return `${version}${new Date(timeStamp).toISOString()}`
  },
  folder: 'benchmark/results',
  version: null,
}

const save = (options = {}) => (suiteObj) => {
  const opt = { ...defaultOptions, ...options }

  suiteObj.on('complete', (event) => {
    const results = getEssentialResults(event.currentTarget)
    const fileName = typeof opt.file === 'function' ? opt.file(event) : opt.file

    fs.ensureDirSync(opt.folder)

    fs.writeFileSync(
      path.join(opt.folder, `${fileName}.json`),
      JSON.stringify(results, null, 2),
    )
  })

  return suiteObj
}

export { save }
export default save
