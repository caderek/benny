import * as fs from 'fs-extra'
import * as kleur from 'kleur'
import * as path from 'path'
import getEssentialResults from './internal/getEssentialResults'

const defaultOptions = {
  file: ({ timeStamp }) => {
    return new Date(timeStamp).toISOString()
  },
  folder: 'benchmark/results',
  version: null,
}

const save = (options = {}) => (suiteObj) => {
  const opt = { ...defaultOptions, ...options }

  suiteObj.on('complete', (event) => {
    const results = getEssentialResults(event.currentTarget)
    const fileName = typeof opt.file === 'function' ? opt.file(event) : opt.file
    const fullPath = path.join(opt.folder, `${fileName}.json`)

    const fileContent = {
      date: new Date(event.timeStamp).toISOString(),
      version: opt.version,
      results,
    }

    fs.ensureDirSync(opt.folder)

    fs.writeFileSync(fullPath, JSON.stringify(fileContent, null, 2))

    console.log(kleur.cyan(`Saved to: ${fullPath}`))
  })

  return suiteObj
}

export { save }
export default save
