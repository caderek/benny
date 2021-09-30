import b from './index'

const testData = new Array(3000).fill(null).map((val, i) => ({
  if: i,
  currDate: Math.round(Math.random() * 1e10),
  name: Math.round(Math.random() * 1e10).toString(16),
  someString: Math.round(Math.random() * 1e10).toString(16),
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}))

b.suite(
  'Manipulating the array',

  b.add('sort -> filter -> map (mutates!)', () => {
    const items = testData

    return () => {
      items
        .sort((a, b) => b.currDate - a.currDate)
        .filter((el) => el.name.includes('ab'))
        .map((item) => ({
          ...item,
          someString: item.someString.toUpperCase(),
        }))
    }
  }),

  b.add('filter -> sort -> map', () => {
    const items = testData

    return () => {
      items
        .filter((el) => el.name.includes('ab'))
        .sort((a, b) => b.currDate - a.currDate)
        .map((item) => ({
          ...item,
          someString: item.someString.toLowerCase(),
        }))
    }
  }),

  b.add('for..of -> sort', () => {
    const items = testData

    return () => {
      const result = []

      for (const item of items) {
        if (item.name.includes('ab')) {
          result.push({
            ...item,
            someString: item.someString.toUpperCase(),
          })
        }
      }

      result.sort((a, b) => b.currDate - a.currDate)
    }
  }),

  b.add('for -> sort', () => {
    const items = testData

    return () => {
      const result = []

      for (let i = 0; i < items.length; i++) {
        if (items[i].name.includes('ab')) {
          result.push({
            ...items[i],
            someString: items[i].someString.toUpperCase(),
          })
        }
      }

      result.sort((a, b) => b.currDate - a.currDate)
    }
  }),

  b.configure({ minDisplayPrecision: 2, cases: { maxTime: 10 } }),
  b.cycle(),
  b.complete(),
  b.save(),
)
