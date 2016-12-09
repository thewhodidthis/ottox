function Ottox(options = {}, size = 0) {
  const settings = Object.assign({}, Ottox.defaults, options);

  if (typeof options === 'number') {
    settings.rule = parseInt(options, 10);
  }

  if (size !== null && typeof size === 'number') {
    settings.size = parseInt(size, 10);
  }

  // Generation
  this.zoom = Math.max(parseInt(settings.zoom, 10), 0);

  // Cells array
  this.grid = new Uint8Array(settings.size);

  // Rule byte string
  this.rule = this.parseRule(settings.rule);

  // Flip cell in the middle
  this.flip(settings.size * 0.5);
}

Ottox.prototype = {
  constructor: Ottox,

  flip(x) {
    const index = parseInt(x, 10);

    this.grid[index] = !this.grid[index];
  },

  next(prev) {
    const grid = (prev && prev.length) ? prev : this.grid;
    const size = grid.length;
    const next = new Uint8Array(size);

    for (let i = 0; i < size; i += 1) {
      const l = (i - 1 >= 0) ? grid[i - 1] : grid[0];
      const c = grid[i];
      const r = (i + 1 <= grid.length - 1) ? grid[i + 1] : grid[grid.length - 1];

      next[i] = this.getState(l, c, r);
    }

    this.zoom = this.zoom + 1;
    this.grid = next;

    return next;
  },

  getState(l, c, r) {
    return this.rule[parseInt(`${l}${c}${r}`, 2)];
  },

  setRule(target) {
    this.rule = this.parseRule(target);
  },

  parseRule(target) {
    const output = target.toString(2);

    // http://stackoverflow.com/questions/9909038/formatting-hexadecimal-number-in-javascript
    return (`000000000${output}`).substr(-8).split('').reverse();
  }
};

Ottox.defaults = {
  zoom: 0,
  rule: 90,
  size: 10,
};

export default Ottox;
