'use strict';

// # Otto
// Helps deal with CAs

// Wrap
var myMod = function myMod(a, b) {
  return a - b * Math.floor(a / b);
};

// Int to bin in array form
var parseRule = function parseRule(rule) {
  // To binary string
  var code = rule.toString(2);

  // Minimum of 10 digits here
  var view = ('0000000000000000000000000000000' + code).substr(32 - code.length).split('').reverse();

  return view;
};

var otto = {
  // Sensible defaults
  size: 1,

  // Sierpinski
  rule: 90,

  // Yer typical l, c, r
  ends: [-1, 0, 1],

  // Flip cell middle
  seed: function seed(v, i, view) {
    return i === Math.floor(view.length * 0.5);
  },

  // Ruleset index based lookup
  stat: function stat(code, hood) {
    var stats = parseInt(hood.join('').toString(2), 2);
    var state = code[stats];

    return state;
  }
};

var Otto = function Otto(opts) {
  var _Object$assign = Object.assign({}, otto, opts),
      size = _Object$assign.size,
      rule = _Object$assign.rule,
      ends = _Object$assign.ends,
      stat = _Object$assign.stat,
      seed = _Object$assign.seed;

  // Ruleset


  var code = parseRule(rule);

  // Calculate state
  var getState = function getState(v, i, view) {
    var hood = ends.map(function (diff) {
      var site = myMod(diff + i, view.length);
      var flag = view[site];

      return flag;
    });

    return stat(code, hood, v);
  };

  // Cells, zero filled, needs some more work to become of adjustable size
  var next = new Uint8Array(size);

  // Result
  var grid = void 0;

  // Flip cell in middle on init
  next = next.map(seed);

  // Use this
  return function () {
    // Update
    grid = next;

    // Save for later
    next = grid.map(getState);

    // The previous generation
    return grid;
  };
};

module.exports = Otto;
