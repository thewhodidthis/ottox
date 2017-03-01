const Otto = ({ span = 1, size = 0, rule = 90 } = {}) => {
  // Cells
  const grid = new Uint8Array(size);

  // Lookup table
  const ruleset = rule.toString(2).split('').reverse();

  // Wrap index round edges
  // http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain/1082938#1082938
  const getIndex = (a, b) => a - (b * Math.floor(a / b));

  // Calculate state
  const getState = (v, i, arr) => {
    const state = [];

    // The neighborhood
    for (let j = -span; j <= span; j += 1) {
      const x = getIndex(i + j, arr.length);
      const n = arr[x] || 0;

      state.push(n);
    }

    return ruleset[parseInt(state.join(''), 2)];
  };

  // Flip cell in the middle
  grid[Math.floor(size * 0.5)] = 1;

  return {
    next: () => grid.set(grid.map(getState)),
    grid: () => grid,
  };
};

export default Otto;

