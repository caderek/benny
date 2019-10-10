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

const colors = [
  (opacity) => `rgba(63, 142, 252, ${opacity})`,
  (opacity) => `rgba(116, 165, 127, ${opacity})`,
  (opacity) => `rgba(158, 206, 154, ${opacity})`,
  (opacity) => `rgba(58, 175, 185, ${opacity})`,
  (opacity) => `rgba(79, 124, 172, ${opacity})`,
  (opacity) => `rgba(113, 128, 172, ${opacity})`,
  (opacity) => `rgba(182, 140, 184, ${opacity})`,
  (opacity) => `rgba(219, 108, 121, ${opacity})`,
  (opacity) => `rgba(189, 79, 108, ${opacity})`,
  (opacity) => `rgba(138, 79, 125, ${opacity})`,
  (opacity) => `rgba(95, 75, 102, ${opacity})`,
  (opacity) => `rgba(204, 139, 134, ${opacity})`,
  (opacity) => `rgba(215, 129, 106, ${opacity})`,
  (opacity) => `rgba(245, 143, 41, ${opacity})`,
]

const prepareColors = (length, opacity) => {
  return Array.from({ length }, (_, i) => colors[i % colors.length](opacity))
}

const prepareHTMLChart = (summary) => {
  const labels = summary.results.map((result) => result.name)
  const values = summary.results.map((result) => result.ops)

  return format(
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" />
          <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>
          <style>
            .wrapper {
              display: flex;
              flex: wrap;
              order: row;
            }
          </style>
          <title>${summary.name}</title>
        </head>
        <body>
          <div style="max-width: 800px;">
            <canvas id="chart${summary.date.getTime()}" width="16" height="9"></canvas>
          </div>
          <script>
            const format = (num) => {
              const chunked = []
              String(num)
                .split('')
                .reverse()
                .forEach((char, index) => {
                  if (index % 3 === 0) {
                    chunked.unshift([char])
                  } else {
                    chunked[0].unshift(char)
                  }
                })

              return chunked.map((chunk) => chunk.join('')).join(' ')
            }
            const ctx${summary.date.getTime()} = document.getElementById('chart${summary.date.getTime()}').getContext('2d')
            const chart${summary.date.getTime()} = new Chart(ctx${summary.date.getTime()}, {
              type: 'bar',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: [
                  {
                    data: ${JSON.stringify(values)},
                    backgroundColor: ${JSON.stringify(
                      prepareColors(values.length, 0.8),
                    )},
                    borderColor: ${JSON.stringify(
                      prepareColors(values.length, 1),
                    )},
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                legend: {
                  display: false
                },
                title: {
                  display: true,
                  text: '${summary.name}',
                  fontSize: 16,
                  padding: 20,
                },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem) => {
                      return format(tooltipItem.yLabel) + ' ops/s'
                    }
                  }
                },
                scales: {
                  yAxes: [
                    {
                      gridLines: {
                        color: 'rgba(127, 127, 127, 0.2)',
                      },
                      scaleLabel: {
                        display: true,
                        labelString: 'Operations per second',
                      },
                      ticks: {
                        beginAtZero: true,
                        callback: format,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: {
                        color: 'rgba(127, 127, 127, 0.2)',
                      },
                      maxBarThickness: 150,
                    },
                  ],
                },
              },
            })
          </script>
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
  method('chart.html', prepareHTMLChart),
  method(prepareJSON),
)

export default prepareFileContent
