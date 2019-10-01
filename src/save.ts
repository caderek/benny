import { Event, Suite } from 'benchmark'
import * as fs from 'fs-extra'
import * as kleur from 'kleur'
import * as path from 'path'
import { Summary } from './internal/common-types'
import getSummary from './internal/getSummary'

type Options = {
  /**
   * File name or function that takes case timestamp and produces file name
   *
   * @default '<ISO_DATE_TIME>.json'
   */
  file?: string | ((summary: Summary) => string)
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
  file: (summary) => summary.date.toISOString(),
  folder: 'benchmark/results',
  version: null,
}

type Save = (options?: Options) => Promise<(suiteObj: Suite) => Suite>

/**
 * Saves results to a file
 */
const save: Save = async (options = {}) => (suiteObj) => {
  const opt = { ...defaultOptions, ...options }

  suiteObj.on('complete', (event: Event) => {
    const summary: Summary = getSummary(event)

    const results = summary.results.map(
      ({ name, ops, margin, percentSlower }) => {
        return { name, ops, margin, percentSlower }
      },
    )

    const fileName =
      typeof opt.file === 'function' ? opt.file(summary) : opt.file
    const fullPath = path.join(opt.folder, `${fileName}.json`)

    const fileContent = {
      name: summary.name,
      date: summary.date.toISOString(),
      version: opt.version,
      results,
      fastest: summary.fastest,
      slowest: summary.slowest,
    }

    fs.ensureDirSync(opt.folder)

    fs.writeFileSync(fullPath, JSON.stringify(fileContent, null, 2))

    console.log(kleur.cyan(`\nSaved to: ${fullPath}`))
  })

  return suiteObj
}

export { save, Save }
export default save
