'use strict';

var html = document.documentElement;

var label = document.getElementById('label');
var rules = [30, 50, 90, 146, 110, 621];

var seed = Math.floor(Math.random() * rules.length);
var rule = rules[seed];
var cols = 179;
var rows = 179;
var span = 1;

var plot = document.querySelector('canvas').getContext('2d');
var otto = Otto({ rule, cols, rows, span });

var framesN = (139 / rows) + 50;
var frameId;

var frame = function frame(r) {
  var grid = otto();

  for (var j = 0; j < grid.length; j += 1) {
    var x = j % cols;
    var y = Math.floor(j / rows);

    if (grid[j]) {
      plot.fillStyle = 'black';
    } else {
      plot.fillStyle = 'white';
    }

    plot.fillRect(x, y, 2, 2);
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

document.addEventListener('click', function (e) {
  window.location = window.location.origin;
});

window.addEventListener('load', function(e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

