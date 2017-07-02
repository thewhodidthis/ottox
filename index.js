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
  var code = Number(rule).toString(2);

  var zeros = 1024 .toString(2).split('').slice(1).join('');
  var zerosMax = zeros.length;

  // No padding past 10
  var diff = Math.max(zerosMax, zerosMax - code.length);

  // Zero pad ruleset if need be
  return ('' + zeros + code).substr(diff).split('').reverse();
};

// Maker
var Otto = function Otto(data) {
  // Merge options and defaults
  var t0to = Object.assign({
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
  }, data);

  // Rule 90 would be
  // ```['0', '1', '0', '1', '1', '0', '1']```
  var code = parseRule(t0to.rule);

  // Calculate state
  var step = function step(v, i, view) {
    // Collect neighboring flags
    var hood = t0to.ends.map(function (span) {
      // The index for each neighbor
      var site = myMod(span + i, view.length);

      // The state of each neighbor
      return view[site];
    });

    return t0to.stat(hood, code, v);
  };

  // Clipboard, zero filled
  var grid = new Uint8Array(t0to.size);
  var next = t0to.seed;

  // Tick
  return function () {
    grid = grid.map(next);
    next = step;

    return grid;
  };
};

module.exports = Otto;
