import { BenchmarkResult } from './../internal/common-types'
import * as platform from 'platform'
import bench from './bench'
// const v8 = require("v8")
// const vm = require("vm")

// v8.setFlagsFromString("--expose-gc")
// const gc = vm.runInNewContext("gc")

const format = (num: number) => {
  const [whole, fraction] = String(num).split('.')
  const chunked: string[][] = []

  whole
    .split('')
    .reverse()
    .forEach((char, index) => {
      if (index % 3 === 0) {
        chunked.unshift([char])
      } else {
        chunked[0].unshift(char)
      }
    })

  return (
    chunked.map((chunk) => chunk.join('')).join(' ') +
    (fraction ? `.${fraction}` : '')
  )
}

const display = ({ name, stats, time }: BenchmarkResult) => {
  console.log(`Custom - ${name}:`)
  console.log(
    `${format(Number(stats.ops.toFixed(2)))} ops/s ±${stats.margin.toFixed(
      2,
    )}% (${format(stats.n)} samples in ${time}s)\n`,
  )
}

const main = async () => {
  const data = new Array(1e3).fill(null).map((_, i) => i)

  const options = {
    minSamples: 1000,
    minTime: 5000000000n,
    maxTime: 30000000000n,
    maxMargin: 1,
  }

  console.log(`Platform: ${platform.description}\n`)

  // await bench("empty", () => {}, options).then(display)

  await bench(
    'sum',
    () => {
      1 + 1
    },
    options,
  ).then(display)

  await bench(
    'sum 2 elements',
    () => {
      ;[1, 2].reduce((a, b) => a + b)
    },
    options,
  ).then(display)

  await bench(
    'sum 5 elements',
    () => {
      ;[1, 2, 3, 4, 5].reduce((a, b) => a + b)
    },
    options,
  ).then(display)

  await bench(
    `sum ${data.length} elements`,
    () => {
      data.reduce((a, b) => a + b)
    },
    options,
  ).then(display)
}

main()
