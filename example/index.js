'use strict';

var html = document.documentElement;

var label = document.getElementById('rules');
var items = document.getElementsByTagName('li');
var rects = document.getElementsByTagName('canvas');

var boxes = [];
var rules = [30, 99, 90, 105, 109, 118];

label.innerHTML = rules.join(', ');

var frameId;
var frame = function frame() {
  for (var i = 0; i < boxes.length; i += 1) {
    var context = rects[i].getContext('2d');

    var otto = boxes[i];
    var grid = otto.grid();

    for (var j = 0; j < grid.length; j += 1) {
      if (grid[j]) {
        context.fillStyle = 'white';
      } else {
        context.fillStyle = 'black';
      }

      context.fillRect(j, frameId - 1, 1, 1);
    }

    otto.next();
  }

  if (frameId > 179) {
    frameId = window.cancelAnimationFrame(frameId);
  } else {
    frameId = window.requestAnimationFrame(frame);
  }
};

html.className = 'html';

if (window !== window.top) {
  html.className += ' is-iframe';
}

for (var i = 0, total = rules.length; i < total; i += 1) {
  var rule = rules[i];
  var size = rects[i].width;

  var otto = Otto({ rule, size });

  items[i].setAttribute('data-rule', rule);
  boxes.push(otto);
}

window.addEventListener('load', function(e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

