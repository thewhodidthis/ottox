'use strict';

// # Otto
// Helps deal CAs

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
var myMod = function myMod(a, b) {
  return a - b * Math.floor(a / b);
};

// Rule to binary convert
var parseRule = function parseRule(rule) {
  // Base 2 digits
  var code = rule.toString(2);

  // Zero pad ruleset
  var view = ('0000000000000000000000000000000' + code).substr(32 - code.length).split('').reverse();

  return view;
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
  stat: function stat(code, hood) {
    var stats = parseInt(hood.join('').toString(2), 2);
    var state = code[stats];

    return state;
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

  // Store ruleset


  var code = parseRule(rule);

  // Calculate state
  var getState = function getState(v, i, view) {
    // Collect neighbors
    var hood = ends.map(function (diff) {
      // The index for each neighbor cell
      var site = myMod(diff + i, view.length);

      // The state of each neighbor
      var flag = view[site];

      return flag;
    });

    return stat(code, hood, v);
  };

  // Clipboard, zero filled, need to work out adjustable size part
  var next = new Uint8Array(size);

  // Store results
  var grid = void 0;

  // Seed how on init
  next = next.map(seed);

  return function () {
    // Update
    grid = next;

    // Save for later
    next = grid.map(getState);

    // The memo
    return grid;
  };
};

module.exports = Otto;
