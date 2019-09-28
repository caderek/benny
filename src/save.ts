import { Event, Suite } from 'benchmark'
import * as fs from 'fs-extra'
import * as kleur from 'kleur'
import * as path from 'path'
import getEssentialResults from './internal/getEssentialResults'

type Options = {
  /**
   * File name or function that takes case timestamp and produces file name
   *
   * @default '<ISO_DATE_TIME>.json'
   */
  file?: string | ((event: Event) => string)
  /**
   * Destination folder fo for results file
   *
   * Note: will be created if not exists
   *
   * @default 'benchmark/results'
   */
  folder?: string
  /**
   * Suite version - will be added to the results file content
   *
   * @default null
   */
  version?: string
}

const defaultOptions: Options = {
  file: (event) => {
    return new Date(event.timeStamp).toISOString()
  },
  folder: 'benchmark/results',
  version: null,
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
