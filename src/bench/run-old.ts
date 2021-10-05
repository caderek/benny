import b from '../index'
import * as platform from 'platform'

const main = async () => {
  const data = new Array(1e3).fill(null).map((_, i) => i)

  console.log(`Platform: ${platform.description}\n`)

  b.suite(
    'Old',

    b.add('noop', () => {}),

    b.add('sum', () => {
      1 + 1
    }),

    b.add('sum 2 elements', () => {
      ;[1, 2].reduce((a, b) => a + b)
    }),

    b.add('sum 5 elements', () => {
      ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
    }),

    b.add(
      `sum ${data.length} elements`,
      () => {
        data.reduce((a, b) => a + b)
      },
      { maxTime: 120 },
    ),

    b.cycle(),
    b.complete(),
  )
}

main()
