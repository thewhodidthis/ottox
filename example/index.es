import Otto from '../index.es';

const items = document.getElementsByTagName('li');
const plots = document.getElementsByTagName('canvas');

const size = 180;
const ends = [-2, -1, 0, 1, 2];

const ottos = [];
const rules = [30, 99, 210, 2123739367, 988197457, 2713874006];

let frameId = -1;

const tick = fn => window.requestAnimationFrame(fn);
const stop = id => window.cancelAnimationFrame(id);

const draw = () => {
  for (let i = 0; i < rules.length; i += 1) {
    const plot = plots[i].getContext('2d');
    const otto = ottos[i];
    const fill = ['black', 'white'];

    if (rules[i] < 256) {
      fill.reverse();
    }

    const grid = otto();

    for (let j = 0; j < grid.length; j += 1) {
      const x = j % size;
      const y = frameId - 1;

      if (grid[j]) {
        plot.fillStyle = fill[0];
      } else {
        plot.fillStyle = fill[1];
      }

      plot.fillRect(x, y, 1, 1);
    }
  }

  frameId = frameId > size ? stop(frameId) : tick(draw);
};

rules.forEach((rule, i) => {
  const item = items[i];

  item.setAttribute('data-rule', rule);

  const data = { rule, size };
  const papa = rule < 256 ? data : Object.assign({ ends }, data);
  const otto = Otto(papa);

  ottos.push(otto);
});

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

window.addEventListener('load', () => {
  frameId = tick(draw);
});

