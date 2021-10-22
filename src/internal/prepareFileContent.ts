import { method, multi } from '@arrows/multimethod'
import { parse } from 'json2csv'
import { CaseResultWithDiff, SaveOptions, Summary } from './common-types'
import { stripIndent, html } from 'common-tags'

const flattenResults = (results: CaseResultWithDiff[]) => {
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

const prepareJSON = (summary: Summary, options: SaveOptions) => {
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

const prepareCSV = (summary: Summary, options: SaveOptions) => {
  const results = options.details
    ? flattenResults(summary.results)
    : summary.results.map(({ name, ops, margin, percentSlower }) => {
        return { name, ops, margin, percentSlower }
      })

  return parse(results)
}

const prepareHTMLTable = (summary: Summary, options: SaveOptions) => {
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
      return stripIndent`
      <tr>
        ${Object.values(result)
          .map((item) => html`<td>${item}</td>`)
          .join('')}
      </tr>
      `
    })
    .join('')

  const markup = html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" />
        <title>Benny: ${summary.name}</title>
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
  `

  return stripIndent(markup)
}

const prepareColors = (percents: number[]) => {
  return percents.map((percent) => {
    const hue = 120 * ((100 - percent) / 100)
    return `hsl(${hue}, 85%, 55%)`
  })
}

const prepareHTMLChart = (summary: Summary) => {
  const labels = summary.results.map((result) => result.name)
  const values = summary.results.map((result) => result.ops)
  const percents = summary.results.map((result) => result.percentSlower)
  const suffix = summary.date.getTime()

  const markup = html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js"></script>
        <title>${summary.name}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #ddd;
          }

          .container {
            box-sizing: border-box;
            height: 96vh;
            width: 96vw;
            margin: 2vh 2vw;
            resize: both;
            overflow: hidden;
            padding: 20px;
            background: white;
            box-shadow: 0 0 15px #aaa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <canvas id="chart${suffix}" width="16" height="9"></canvas>
        </div>
        <script>
          const format = (num) => {
            const [whole, fraction] = String(num).split('.')
            const chunked = []
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

            const fractionStr = fraction !== undefined ? '.' + fraction : ''

            return (
              chunked.map((chunk) => chunk.join('')).join(' ') + fractionStr
            )
          }
          const ctx${suffix} = document
            .getElementById('chart${suffix}')
            .getContext('2d')
          const chart${suffix} = new Chart(ctx${suffix}, {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [
                {
                  data: ${JSON.stringify(values)},
                  backgroundColor: ${JSON.stringify(prepareColors(percents))},
                  borderColor: ${JSON.stringify(prepareColors(percents))},
                  borderWidth: 2,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: '${summary.name}',
                  font: { size: 20 },
                  padding: 20,
                },
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return format(context.parsed.y) + ' ops/s'
                    },
                  },
                  displayColors: false,
                  backgroundColor: '#222222',
                  padding: 10,
                  cornerRadius: 5,
                  intersect: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    color: '#888888',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Operations per second',
                    padding: 10,
                  },
                  grid: {
                    color: '#888888',
                  },
                },
              },
            },
          })
        </script>
      </body>
    </html>
  `

  return stripIndent(markup)
}

const prepareFileContent = multi(
  (_: Summary, options: SaveOptions) => options.format,
  method('csv', prepareCSV),
  method('table.html', prepareHTMLTable),
  method('chart.html', prepareHTMLChart),
  method(prepareJSON),
)

export default prepareFileContent
