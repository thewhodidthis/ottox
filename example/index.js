'use strict';

var html = document.documentElement;

var label = document.getElementById('label');
var items = document.getElementsByTagName('li');
var plots = document.getElementsByTagName('canvas');

var rules = [30, 99, 210, 110, 118, 182];
var ottos = [];

var cols = 179;
var rows = 1;
var span = 1;

var framesN = cols;
var frameId;

var frame = function frame() {
  for (var i = 0; i < rules.length; i += 1) {
    var plot = plots[i].getContext('2d');
    var otto = ottos[i];
    var grid = otto();

    for (var j = 0; j < grid.length; j += 1) {
      var x = j % cols;
      var y = frameId - 1;

      if (grid[j]) {
        plot.fillStyle = 'white';
      } else {
        plot.fillStyle = 'black';
      }

      plot.fillRect(x, y, 1, 1);
    }
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

label.innerHTML = rules.join(', ');

rules.forEach((rule, i) => {
  var otto = Otto({ rule, cols, rows, span });

  items[i].setAttribute('data-rule', rule);
  ottos.push(otto);
});

// document.addEventListener('click', function (e) {
//   window.location = window.location.href + '/r2';
// });

window.addEventListener('load', function (e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

