import { parse } from 'json2csv'

const prepareJSON = (summary, options) => {
  const results = options.details
    ? summary.results
    : summary.results.map(({ name, ops, margin, percentSlower }) => {
        return { name, ops, margin, percentSlower }
      })

  const content = {
    name: summary.name,
    date: summary.date.toISOString(),
    version: options.version,
    results,
    fastest: summary.fastest,
    slowest: summary.slowest,
  }

  return JSON.stringify(content, null, 2)
}

const prepareCSV = (summary, options) => {
  const results = options.details
    ? summary.results.map((result) => ({
        name: result.name,
        ops: result.ops,
        margin: result.margin,
        percentSlower: result.percentSlower,
        samples: result.samples,
        promise: result.promise,
        min: result.details.min,
        max: result.details.max,
        mean: result.details.mean,
        median: result.details.median,
        standardDeviation: result.details.standardDeviation,
        marginOfError: result.details.marginOfError,
        relativeMarginOfError: result.details.relativeMarginOfError,
        standardErrorOfMean: result.details.standardErrorOfMean,
        sampleVariance: result.details.sampleVariance,
      }))
    : summary.results.map(({ name, ops, margin, percentSlower }) => {
        return { name, ops, margin, percentSlower }
      })

  return parse(results)
}

const prepareFileContent = (summary, options) => {
  return options.format === 'csv'
    ? prepareCSV(summary, options)
    : prepareJSON(summary, options)
}

export default prepareFileContent
