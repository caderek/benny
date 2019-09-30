const b = require('../../lib').default

module.exports = b.suite(
  'Suite two',

  b.add('Multiple two numbers', () => {
    2 * 2
  }),

  b.add('Multiply three numbers', () => {
    2 * 2 * 2
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'suites' }),
)
