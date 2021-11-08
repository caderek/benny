import { Config } from './internal/common-types'

type ConfigureResult = { name: 'config'; entries: Config }
type Configure = (options: Config) => ConfigureResult

/**
 * Configure the benchmark suite.
 * Options can be overwritten per case by each `add` function.
 */
const configure: Configure = (config) => ({
  name: 'config',
  entries: config,
})

export { configure, Configure, ConfigureResult }
export default configure
