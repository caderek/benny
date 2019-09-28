import * as fs from 'fs-extra'
import * as kleur from 'kleur'
import * as path from 'path'
import { Suite } from './internal/common-types'
import getEssentialResults from './internal/getEssentialResults'

const defaultOptions = {
  file: ({ timeStamp }) => {
    return new Date(timeStamp).toISOString()
  },
  folder: 'benchmark/results',
  version: null,
}

type Options = {
  file?: string
  folder?: string
  version?: string
}

type Save = (options?: Options) => (suiteObj: Suite) => Suite

/**
 * Saves results to a file
 */
const save: Save = (options = {}) => (suiteObj) => {
  const opt = { ...defaultOptions, ...options }

  suiteObj.on('complete', (event) => {
    const results = getEssentialResults(event.currentTarget)

    const fastestIndex = results.reduce(
      (prev, next, index) => {
        return next.ops > prev.ops ? { ops: next.ops, index } : prev
      },
      { ops: 0, index: null },
    ).index

    const fileName = typeof opt.file === 'function' ? opt.file(event) : opt.file
    const fullPath = path.join(opt.folder, `${fileName}.json`)

    const fileContent = {
      name: event.currentTarget.name,
      date: new Date(event.timeStamp).toISOString(),
      version: opt.version,
      results,
      fastest: {
        name: results[fastestIndex].name,
        index: fastestIndex,
      },
    }

    fs.ensureDirSync(opt.folder)

    fs.writeFileSync(fullPath, JSON.stringify(fileContent, null, 2))

    console.log(kleur.cyan(`Saved to: ${fullPath}`))
  })

  return suiteObj
}

export { save, Save }
export default save
