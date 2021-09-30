import { pipe } from '@arrows/composition'
import { Event, Suite } from 'benchmark'
import * as kleur from 'kleur'
import { SkipResult } from './add'
import { ConfigureResult } from './configure'
import { Summary, Config } from './internal/common-types'
import getSummary from './internal/getSummary'

type PartialMethod = (config: Config) => Promise<(suiteObj: Suite) => Suite>
type Entry = PartialMethod | SkipResult | ConfigureResult

type SuiteFn = (name: string, ...fns: Entry[]) => Promise<Summary>

/**
 * Creates and runs benchmark suite
 */
const suite: SuiteFn = async (name, ...entries) => {
  const methods = entries.filter(
    (entry) => entry instanceof Function,
  ) as PartialMethod[]

  const configResult = entries.find(
    (entry) => entry.name === 'config',
  ) as ConfigureResult

  const config = configResult ? configResult.entries : {}

  const unpackedMethods = await Promise.all(
    methods.map((method) => method(config)),
  )

  const suiteObj = new Suite(name).on('start', () => {
    console.log(kleur.blue(`Running "${name}" suite...`))
  })

  const hasOnly = unpackedMethods.filter((fn) => fn.name === 'only').length > 0

  const items = hasOnly
    ? unpackedMethods.filter((fn) => fn.name !== 'add')
    : unpackedMethods

  return new Promise((resolve, reject) => {
    ;(pipe(...items)(suiteObj) as Suite)
      .on('complete', (event: Event) =>
        resolve(getSummary(event, config.minDisplayPrecision ?? 0)),
      )
      .on('error', reject)
      .run()
  })
}

export { suite }
export default suite
