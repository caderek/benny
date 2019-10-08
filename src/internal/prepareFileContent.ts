import { method, multi } from '@arrows/multimethod'
import { parse } from 'json2csv'
import { format } from 'prettier'

const flattenResults = (results) => {
  return results.map((result) => ({
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
}

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
    ? flattenResults(summary.results)
    : summary.results.map(({ name, ops, margin, percentSlower }) => {
        return { name, ops, margin, percentSlower }
      })

  return parse(results)
}

const prepareHTMLTable = (summary, options) => {
  const results = options.details
    ? flattenResults(summary.results)
    : summary.results.map(({ name, ops, margin, percentSlower }) => {
        return { name, ops, margin, percentSlower }
      })

  const headers = Object.keys(results[0])
    .map((key) => `<th>${key}</th>`)
    .join('')

  const rows = results
    .map((result) => {
      return `<tr>${Object.values(result)
        .map((item) => `<td>${item}</td>`)
        .join('')}</tr>`
    })
    .join('')

  return format(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" />
        <title>${summary.name}</title>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `,
    { parser: 'html' },
  )
}

const prepareFileContent = multi(
  (_, options) => options.format,
  method('csv', prepareCSV),
  method('table.html', prepareHTMLTable),
  method(prepareJSON),
)

export default prepareFileContent
