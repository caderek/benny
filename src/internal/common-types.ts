export type CaseResult = {
  name: string
  ops: number
  margin: number
  options: {
    delay: number
    initCount: number
    minTime: number
    maxTime: number
    minSamples: number
  }
  samples: number
  promise: boolean
}

export type Summary = {
  name: string
  date: Date
  results: CaseResult[]
  fastest: {
    name: string
    index: number
  }
  slowest: {
    name: string
    index: number
  }
}
