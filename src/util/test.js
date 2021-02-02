export const bloatStaticData = (data = [], multiplier = 10) =>
  new Array(multiplier)
    .fill(JSON.parse(JSON.stringify(data)))
    .reduce((prev, curr) => [...prev, ...curr], []);
