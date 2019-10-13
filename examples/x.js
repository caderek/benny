const { add, complete, cycle, save, suite } = require('benny')

function allEqualImperative(arr) {
  for (item of arr) {
    if (item !== arr[0]) {
      return false
    }
  }
  return true
}

function allEqualEveryDeclarative(arr) {
  const first = arr[0]
  return arr.every((item) => item === first)
}

const inputHundred = [...'a'.repeat(100)]
const inputMillion = [...'a'.repeat(1000000)]

suite(
  'All equal - hundred elements',

  add('Imperative', () => {
    allEqualImperative(inputHundred)
  }),

  add('Declarative', () => {
    allEqualEveryDeclarative(inputHundred)
  }),

  cycle(),
  complete(),
)

suite(
  'All equal - million elements',

  add('Imperative', () => {
    allEqualImperative(inputMillion)
  }),

  add('Declarative', () => {
    allEqualEveryDeclarative(inputMillion)
  }),

  cycle(),
  complete(),
)
