# Benny - handy benchmarking tool based on [benchmark](https://www.npmjs.com/package/benchmark) package

![CircleCI](https://img.shields.io/circleci/build/github/caderek/redux-multimethod)
![David](https://img.shields.io/david/caderek/redux-multimethod)
![Codecov](https://img.shields.io/codecov/c/github/caderek/redux-multimethod)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/redux-multimethod)
[![GitHub license](https://img.shields.io/github/license/caderek/redux-multimethod)](https://github.com/caderek/redux-multimethod/blob/master/LICENSE)

## Overview

Redux-multimethod is a tiny wrapper for `@arrows/multimethod` package, that allows you to reduce boilerplate code in your Redux-like reducers.

## Quick example

```js
import { reducer, delegate } 'redux-multimethod'

/* Standard Redux stuff (optional, but will make example more clear */

const initialState = []

// Action names:
const ADD_ENTRY = 'ADD_ENTRY'
const UPDATE_ENTRY = 'UPDATE_ENTRY'

// Transformations (standard reducers for single action - like in switch case)
const addEntry = (state, action) => {
  return [...state, action.text]
}

const updateEntry = (state, action) => {
  return state.map((item, index) =>
    index === action.index ? action.text : item,
  )
}

/* Redux-multimethod in action! */

const app = reducer(
  delegate(ADD_ENTRY, addEntry),
  delegate(
    UPDATE_ENTRY, // actionType (required)
    updateEntry,  // transformation (required)
    (state, action) => state[action.index].text !== action.text // guard function (optional)
  )
  // ...other - you can add arbitrary number of delegates in format:
  // delegate(actionType, transformation, guard?)
)

export { app } // uninitialized reducer for testing
export default app(initialState) // initialized reducer with initial state
```

That's pretty much it. But what is this `guard function`?

## Guard functions

Guard function is an optional third argument, that you can pass to each delegate.

It has signature that is almost identical as reducer/transformation signature. It takes state and action, but should return a boolean value (or at least output will be treated as such).

When guard function returns falsy value, the transformation is not executed, and old state is returned. It prevents unnecessary calculations - useful in some edge cases.

## License

Project is under open, non-restrictive [ISC license](LICENSE).
