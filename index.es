// # Otto
// Helps deal CAs

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
const myMod = (a, b) => a - (b * Math.floor(a / b));
const zeros = (1024).toString(2).split('').slice(1).join('');
const zerosMax = zeros.length;

// Rule to binary convert
const parseRule = (rule) => {
  // Base 2 digits
  const code = Number(rule).toString(2);

  // No padding past 10
  const diff = Math.max(zerosMax, zerosMax - code.length);

  // Zero pad ruleset if need be
  return `${zeros}${code}`.substr(diff).split('').reverse();
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
  stat: (hood, code) => {
    const flags = hood.join('').toString(2);
    const stats = parseInt(flags, 2);

    return code[stats];
  },
};

// Setup
const Otto = (opts) => {
  // Merge options and defaults
  const { size, rule, ends, stat, seed } = Object.assign({}, data, opts);

  // Rule 90 would be ['0', '1', '0', '1', '1', '0', '1']
  const code = parseRule(rule);

  // Calculate state
  const step = (v, i, view) => {
    // Collect neighboring flags
    const hood = ends.map((span) => {
      // The index for each neighbor
      const site = myMod(span + i, view.length);

      // The state of each neighbor
      return view[site];
    });

    return stat(hood, code, v);
  };

  // Clipboard, zero filled, need to work out adjustable size part
  let grid = new Uint8Array(size);
  let next = seed;

  // Tick
  return () => {
    grid = grid.map(next);
    next = step;

    return grid;
  };
};

export default Otto;

