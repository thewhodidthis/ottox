// # Otto
// Helps deal with CAs

// Wrap
const myMod = (a, b) => a - (b * Math.floor(a / b));

// Int to bin in array form
const parseRule = (rule) => {
  // To binary string
  const code = rule.toString(2);

  // Minimum of 10 digits here
  const view = `0000000000000000000000000000000${code}`.substr(32 - code.length).split('').reverse();

  return view;
};

const otto = {
  // Sensible defaults
  size: 1,

  // Sierpinski
  rule: 90,

  // Yer typical l, c, r
  ends: [-1, 0, 1],

  // Flip cell middle
  seed: (v, i, view) => i === Math.floor(view.length * 0.5),

  // Ruleset index based lookup
  stat: (code, hood) => {
    const stats = parseInt(hood.join('').toString(2), 2);
    const state = code[stats];

    return state;
  },
};

const Otto = (opts) => {
  const { size, rule, ends, stat, seed } = Object.assign({}, otto, opts);

  // Ruleset
  const code = parseRule(rule);

  // Calculate state
  const getState = (v, i, view) => {
    const hood = ends.map((diff) => {
      const site = myMod(diff + i, view.length);
      const flag = view[site];

      return flag;
    });

    return stat(code, hood, v);
  };

  // Cells, zero filled, needs some more work to become of adjustable size
  let next = new Uint8Array(size);

  // Result
  let grid;

  // Flip cell in middle on init
  next = next.map(seed);

  // Use this
  return () => {
    // Update
    grid = next;

    // Save for later
    next = grid.map(getState);

    // The previous generation
    return grid;
  };
};

export default Otto;

