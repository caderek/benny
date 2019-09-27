const getEssentialResults = (currentTarget) => {
  return Object.entries(currentTarget)
    .filter(([key]) => !Number.isNaN(Number(key)))
    .map((item) => {
      return item
    })
    .map(([_, target]) => {
      return {
        // @ts-ignore
        name: target.name,
        // @ts-ignore
        ops: Math.round(target.hz),
        // @ts-ignore
        deviation: Number(target.stats.rme.toFixed(2)),
      }
    })
}

export default getEssentialResults
