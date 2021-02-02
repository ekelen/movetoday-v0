/**
 *
 * @param {Array} data
 * @param {Number} multiplier
 *
 * @returns {Array} - like data, but each array item appears _multipler_ times
 */
export const bloatDataInMemory = (data = [], multiplier = 10) =>
  new Array(multiplier)
    .fill(JSON.parse(JSON.stringify(data)))
    .reduce((prev, curr) => [...prev, ...curr], []);
