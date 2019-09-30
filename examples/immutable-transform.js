const { add, complete, cycle, save, suite } = require('benny')
const Immutable = require('immutable')
const { produce } = require('immer')
const path = require('path')

const initializeTestData = () => ({
  foo: {
    bar: {
      baz: 'elo',
      bat: [1, 2, 3],
    },
  },
  batman: 'NaNNaNNaNNaN',
})

module.exports = suite(
  'Immutable transformations',

  add('Pure JS', () => {
    const data = initializeTestData()

    return () => {
      const newData = {
        ...data,
        foo: {
          bar: {
            baz: 'yo',
            bat: data.foo.bar.bat.map((x, i) => (i === 1 ? 7 : x)),
          },
        },
      }
    }
  }),

  add('Immer', () => {
    const data = initializeTestData()

    return () => {
      const newData = produce(data, (draft) => {
        draft.foo.bar.baz = 'yo'
        draft.foo.bar.bat[1] = 7
      })
    }
  }),

  add('Immutable.js', () => {
    const data = Immutable.fromJS(initializeTestData())

    return () => {
      const newData = data
        .setIn(['foo', 'bar', 'baz'], 'yo')
        .setIn(['foo', 'bar', 'bat', 1], 7)
        .toJS()
    }
  }),

  cycle(),
  complete(),
  save({ file: 'immutable-trans', folder: path.join(__dirname, 'results') }),
)
