const getEssentialResults = (currentTarget) => {
  return Object.entries(currentTarget)
    .filter(([key]) => !Number.isNaN(Number(key)))
    .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : 0))
    .map((item) => {
      return item
    })
    .map(([_, target]) => {
      return {
        // @ts-ignore
        deviation: Number(target.stats.rme.toFixed(2)),
        // @ts-ignore
        name: target.name,
        // @ts-ignore
        ops: Math.round(target.hz),
      }
    })
}

export default getEssentialResults
