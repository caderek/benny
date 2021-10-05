const isNode = typeof process !== 'undefined'
const isModernBrowser = typeof performance !== 'undefined'

if (isNode) {
  if (process?.hrtime?.bigint === undefined) {
    throw new Error('Unsupported Node version (< v10.7.0)')
  }
} else if (!isModernBrowser) {
  throw new Error('Unsupported browser')
}

export default isNode
