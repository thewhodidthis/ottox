'use strict';

function Ottox(options, size) {
  var settings = Object.create(Ottox.defaults);

  if (options !== null) {
    if (typeof options === 'object') {
      for (var prop in settings) {
        if (options.hasOwnProperty(prop)) {
          settings[prop] = options[prop];
        }
      }
    }

    if (typeof options === 'number') {
      settings.rule = parseInt(options, 10);
    }
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

  next: function next(prev) {
    var prev = (prev && prev.length) ? prev : this.grid;
    var size = prev.length;
    var next = [];

    for (var i = 0; i < size; i += 1) {
      var l = (i - 1 >= 0) ? prev[i - 1] : prev[0];
      var c = prev[i];
      var r = (i + 1 <= prev.length - 1) ? prev[i + 1] : prev[prev.length - 1];

      next[i] = this.getState(l, c, r);
    }

    this.zoom = this.zoom + 1;
    this.grid = next;

    return next;
  },

  flip: function(x) {
    var x = x | 0;

    return this.grid[x] = !this.grid[x] | 0;
  },

  getState: function getState(l, c, r) {
    return this.rule[parseInt('' + l + c + r, 2)] | 0;
  },

  setRule: function setRule(target) {
    return this.rule = this.parseRule(target);
  },

  parseRule: function parseRule(target) {

    // http://stackoverflow.com/questions/9909038/formatting-hexadecimal-number-in-javascript
    return ('000000000' + target.toString(2)).substr(-8).split('').reverse();
  }
};

Ottox.defaults = {
  zoom: 0,
  rule: 90,
  size: 10,
};

module.exports = Ottox;
