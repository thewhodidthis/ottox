// # Otto
// Helps deal with CAs

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
const mod = (a, b) => a - (b * Math.floor(a / b));
const sum = (a, b) => a + b;
const glu = (a, b, i) => a | (b << i);

const Otto = ({ rule = 90, rows = 1, cols = 1, span = 1 } = {}) => {
  // Grid size
  const area = rows * cols;

  // The neighborhood, store distance from each neighbor
  const hood = rows > 1 ? [0, cols, -cols, 1, -1] : ((arr) => {
    for (let i = 0, max = 1 + (2 * span); i < max; i += 1) {
      arr.push(span - i);
    }

    return arr;
  })([]);

  // Decide type of sum
  const getSum = rows > 1 ? sum : glu;

  // Calculate state
  const getState = (v, i, arr) => {
    const state = hood.map((diff) => {
      const site = mod(diff + i, arr.length);
      const flag = arr[site];

      // Just works :)
      return (diff === 0 && flag === 1 && rows > 1) ? hood.length : flag;
    }).reduce(getSum);

    return rule & (1 << state) ? 1 : 0;
  };

  // Cells, zero filled
  let memo = new Int8Array(area);

  // Result
  let grid;

  return ((seed) => {
    // Flip cell in middle on init
    memo[seed] = 1;

    return () => {
      // Update
      grid = memo;

      // Save for later
      memo = grid.map(getState);

      // The previous generation
      return grid;
    };
  })(Math.floor(area * 0.5));
};

export default Otto;

