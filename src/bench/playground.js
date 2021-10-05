const arr = {
  number(length) {
    return new Array(length).fill(0).map((x) => Math.random())
  },
}

console.log(arr.number(5))

const test = () => {}
