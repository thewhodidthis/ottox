'use strict';

// # Otto
// Helps deal CAs

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
var myMod = function myMod(a, b) {
  return a - b * Math.floor(a / b);
};
var zeros = 1024 .toString(2).split('').slice(1).join('');
var zerosMax = zeros.length;

// Rule to binary convert
var parseRule = function parseRule(rule) {
  // Base 2 digits
  var code = rule.toString(2);
  var diff = Math.max(zerosMax, zerosMax - code.length);

  // Zero pad ruleset
  return ('' + zeros + code).substr(diff).split('').reverse();
};

// Defaults
var data = {
  size: 1,
  rule: 30,

  // How far from center lie the neighbors
  ends: [-1, 0, 1],

  // Flip middle cell
  seed: function seed(v, i, view) {
    return i === Math.floor(view.length * 0.5);
  },

  // Index based lookup
  stat: function stat(hood, code) {
    var flags = hood.join('').toString(2);
    var stats = parseInt(flags, 2);

    return code[stats];
  }
};

// Setup
var Otto = function Otto(opts) {
  // Merge options and defaults
  var _Object$assign = Object.assign({}, data, opts),
      size = _Object$assign.size,
      rule = _Object$assign.rule,
      ends = _Object$assign.ends,
      stat = _Object$assign.stat,
      seed = _Object$assign.seed;

  var code = parseRule(rule);

  // Calculate state
  var step = function step(v, i, view) {
    var hood = ends.map(function (span) {
      // The index for each neighbor cell
      var site = myMod(span + i, view.length);

      // The state of each neighbor
      return view[site];
    });

    return stat(hood, code, v);
  };

  // Clipboard, zero filled, need to work out adjustable size part
  var grid = new Uint8Array(size);
  var next = seed;

  return function () {
    // Update
    grid = grid.map(next);
    next = step;

    return grid;
  };
};

module.exports = Otto;
