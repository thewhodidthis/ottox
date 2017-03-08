'use strict';

var html = document.documentElement;

var label = document.getElementById('label');
var rules = [30, 50, 90, 146, 130, 186];

var seed = Math.floor(Math.random() * rules.length);
var rule = rules[seed];
var cols = 179;
var rows = 179;
var span = 1;

var plot = document.querySelector('canvas').getContext('2d');
var otto = Otto({ rule, cols, rows, span });

var framesN = (140 / rows) + 39;
var frameId;

var frame = function frame(r) {
  var grid = otto();

  for (var j = 0; j < grid.length; j += 1) {
    var x = j % cols;
    var y = Math.floor(j / rows);

    if (grid[j]) {
      plot.fillStyle = 'white';
    } else {
      plot.fillStyle = 'black';
    }

    plot.fillRect(x, y, 1, 1);
  }

  if (frameId > framesN) {
    frameId = window.cancelAnimationFrame(frameId);
  } else {
    frameId = window.requestAnimationFrame(frame);
  }
};

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

label.innerHTML = rule;

window.addEventListener('load', function(e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

