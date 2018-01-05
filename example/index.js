(function () {
'use strict';

// # Otto
// Helps create elementary Cellular Automata

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
  return ("" + zeros + code).substr(diff).split('').reverse()
};

// Master grid maker
var otto = function (data) {
  // Merge options and defaults
  var papa = Object.assign({
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

      return code[stats]
    }
  }, data);

  // Rule 90 would be
  // ```['0', '1', '0', '1', '1', '0', '1']```
  var code = parseRule(papa.rule);

  // Calculate state
  var step = function (v, i, view) {
    // Collect neighboring flags
    var hood = papa.ends.map(function (span) {
      // The index for each neighbor
      var site = myMod(span + i, view.length);

      // The state of each neighbor
      return view[site]
    });

    return papa.stat(hood, code, v)
  };

  // Clipboard, zero filled
  var grid = new Uint8Array(papa.size);
  var next = papa.seed;

  // Tick
  return function () {
    grid = grid.map(next);
    next = step;

    return grid
  }
};

var items = document.getElementsByTagName('li');
var plots = document.getElementsByTagName('canvas');

var lines = [];
var rules = [30, 99, 26, 2713874006, 184, 988197457];

var size = 180;
var ends = [-2, -1, 0, 1, 2];
var seed = function () { return Math.random() > 0.5; };

var frames = -1;

var tick = function (fn) { return window.requestAnimationFrame(fn); };
var stop = function (id) { return window.cancelAnimationFrame(id); };

var draw = function () {
  for (var i = 0, k = rules.length; i < k; i += 1) {
    var fill = ['black', 'white'];
    var plot = plots[i].getContext('2d');
    var next = lines[i];
    var rule = rules[i];

    if (rule < 100) {
      fill.reverse();
    }

    var data = next();

    for (var j = 0, n = data.length; j < n; j += 1) {
      var x = j % size;
      var y = frames - 1;

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

rules.forEach(function (rule, i) {
  var item = items[i];

  item.setAttribute('data-rule', rule);

  var data = { rule: rule, size: size };

  if (rule > 100) {
    data.seed = seed;
  }

  if (rule > 256) {
    data.ends = ends;
  }

  var line = otto(data);

  lines.push(line);
});

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

window.addEventListener('load', function () {
  frames = tick(draw);
});

}());

