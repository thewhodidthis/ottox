(function () {
'use strict';

// # Otto
// Helps deal CAs

// Wrap index round edges
// http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
var myMod = function (a, b) { return a - (b * Math.floor(a / b)); };

// Rule to binary convert
var parseRule = function (rule) {
  // Base 2 digits
  var code = Number(rule).toString(2);

  var zeros = (1024).toString(2).split('').slice(1).join('');
  var zerosMax = zeros.length;

  // No padding past 10
  var diff = Math.max(zerosMax, zerosMax - code.length);

  // Zero pad ruleset if need be
  return ("" + zeros + code).substr(diff).split('').reverse();
};

// Maker
var Otto = function (data) {
  // Merge options and defaults
  var t0to = Object.assign({
    size: 1,
    rule: 30,

    // How far from center lie the neighbors
    ends: [-1, 0, 1],

    // Flip middle cell
    seed: function (v, i, view) { return i === Math.floor(view.length * 0.5); },

    // Index based lookup
    stat: function (hood, code) {
      var flags = hood.join('').toString(2);
      var stats = parseInt(flags, 2);

      return code[stats];
    },
  }, data);

  // Rule 90 would be
  // ```['0', '1', '0', '1', '1', '0', '1']```
  var code = parseRule(t0to.rule);

  // Calculate state
  var step = function (v, i, view) {
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

var items = document.getElementsByTagName('li');
var plots = document.getElementsByTagName('canvas');

var size = 180;
var ends = [-2, -1, 0, 1, 2];

var ottos = [];
var rules = [30, 99, 210, 2123739367, 988197457, 2713874006];

var frameId = -1;

var tick = function (fn) { return window.requestAnimationFrame(fn); };
var stop = function (id) { return window.cancelAnimationFrame(id); };

var draw = function () {
  for (var i = 0; i < rules.length; i += 1) {
    var plot = plots[i].getContext('2d');
    var otto = ottos[i];
    var fill = ['black', 'white'];

    if (rules[i] < 256) {
      fill.reverse();
    }

    var grid = otto();

    for (var j = 0; j < grid.length; j += 1) {
      var x = j % size;
      var y = frameId - 1;

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

rules.forEach(function (rule, i) {
  var item = items[i];

  item.setAttribute('data-rule', rule);

  var data = { rule: rule, size: size };
  var papa = rule < 256 ? data : Object.assign({ ends: ends }, data);
  var otto = Otto(papa);

  ottos.push(otto);
});

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

window.addEventListener('load', function () {
  frameId = tick(draw);
});

}());

