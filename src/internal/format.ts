type Format = (num: number) => string

const format: Format = (num) => {
  const chunked: any[] = []

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

export default format
