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

type CaseResultWithDiff = CaseResult & { percentSlower: number }

export type Summary = {
  name: string
  date: Date
  results: CaseResultWithDiff[]
  fastest: {
    name: string
    index: number
  }
  slowest: {
    name: string
    index: number
  }
}
