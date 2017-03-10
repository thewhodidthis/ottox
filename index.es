// # Otto
// Helps deal CAs

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
const myMod = (a, b) => a - (b * Math.floor(a / b));

// Rule to binary convert
const parseRule = (rule) => {
  // Base 2 digits
  const code = rule.toString(2);

  // Zero pad ruleset
  const view = `0000000000000000000000000000000${code}`.substr(32 - code.length).split('').reverse();

  return view;
};

// Defaults
const data = {
  size: 1,
  rule: 30,

  // How far from center lie the neighbors
  ends: [-1, 0, 1],

  // Flip middle cell
  seed: (v, i, view) => i === Math.floor(view.length * 0.5),

  // Index based lookup
  stat: (code, hood) => {
    const stats = parseInt(hood.join('').toString(2), 2);
    const state = code[stats];

    return state;
  },
};

// Setup
const Otto = (opts) => {
  // Merge options and defaults
  const { size, rule, ends, stat, seed } = Object.assign({}, data, opts);
  const code = parseRule(rule);

  // Calculate state
  const getState = (v, i, view) => {
    // Collect neighbors
    const hood = ends.map((diff) => {
      // The index for each neighbor cell
      const site = myMod(diff + i, view.length);

      // The state of each neighbor
      const flag = view[site];

      return flag;
    });

    return stat(code, hood, v);
  };

  // Clipboard, zero filled, need to work out adjustable size part
  let next = new Uint8Array(size);

  // Seed how on init
  next = next.map(seed);

  return () => {
    // Update
    let grid = next;

    // Save for later
    next = grid.map(getState);

    // The memo
    return grid;
  };
};

export default Otto;

