(function () {
'use strict';

// # Otto
// Helps create elementary Cellular Automata

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
const myMod = (a, b) => a - (b * Math.floor(a / b));

// Rule to binary convert
const parseRule = (rule) => {
  // Base 2 digits
  const code = Number(rule).toString(2);

  const zeros = (1024).toString(2).split('').slice(1).join('');
  const zerosMax = zeros.length;

  // No padding past 10
  const diff = Math.max(zerosMax, zerosMax - code.length);

  // Zero pad ruleset if need be
  return `${zeros}${code}`.substr(diff).split('').reverse()
};

// Master grid maker
const otto = (data) => {
  // Merge options and defaults
  const papa = Object.assign({
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

      return code[stats]
    }
  }, data);

  // Rule 90 would be
  // ```['0', '1', '0', '1', '1', '0', '1']```
  const code = parseRule(papa.rule);

  // Calculate state
  const step = (v, i, view) => {
    // Collect neighboring flags
    const hood = papa.ends.map((span) => {
      // The index for each neighbor
      const site = myMod(span + i, view.length);

      // The state of each neighbor
      return view[site]
    });

    return papa.stat(hood, code, v)
  };

  // Clipboard, zero filled
  let grid = new Uint8Array(papa.size);
  let next = papa.seed;

  // Tick
  return () => {
    grid = grid.map(next);
    next = step;

    return grid
  }
};

const items = document.getElementsByTagName('li');
const plots = document.getElementsByTagName('canvas');

const lines = [];
const rules = [30, 99, 26, 2713874006, 184, 988197457];

const size = 180;
const ends = [-2, -1, 0, 1, 2];
const seed = () => Math.random() > 0.5;

let frames = -1;

const tick = fn => window.requestAnimationFrame(fn);
const stop = id => window.cancelAnimationFrame(id);

const draw = () => {
  for (let i = 0, k = rules.length; i < k; i += 1) {
    const fill = ['black', 'white'];
    const plot = plots[i].getContext('2d');
    const next = lines[i];
    const rule = rules[i];

    if (rule < 100) {
      fill.reverse();
    }

    const data = next();

    for (let j = 0, n = data.length; j < n; j += 1) {
      const x = j % size;
      const y = frames - 1;

      if (data[j]) {
        plot.fillStyle = fill[0];
      } else {
        plot.fillStyle = fill[1];
      }

      plot.fillRect(x, y, 1, 1);
    }
  }

  frames = frames > size ? stop(frames) : tick(draw);
};

rules.forEach((rule, i) => {
  const item = items[i];

  item.setAttribute('title', rule);

  const data = { rule, size };

  if (rule > 100) {
    data.seed = seed;
  }

  if (rule > 256) {
    data.ends = ends;
  }

  const line = otto(data);

  lines.push(line);
});

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

window.addEventListener('load', () => {
  frames = tick(draw);
});

}());
