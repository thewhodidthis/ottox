'use strict';

var html = document.documentElement;

var span = document.getElementById('rules');
var items = document.getElementsByTagName('li');
var frames = document.getElementsByTagName('canvas');

var boxes = [];
var rules = [30, 99, 90, 105, 109, 118];
var width = frames[0].width;

var frameId;
var frame = function() {
  for (var i = 0; i < boxes.length; i += 1) {
    var box = boxes[i];
    var context = frames[i].getContext('2d');

    for (var x = 0; x < box.grid.length; x += 1) {
      if (box.grid[x]) {
        context.fillStyle = 'white';
      } else {
        context.fillStyle = 'black';
      }

      context.fillRect(x, box.zoom, 1, 1);
    }

    box.next();
  }

  if (frameId >= width) {
    frameId = window.cancelAnimationFrame(frameId);
  } else {
    frameId = window.requestAnimationFrame(frame);
  }
};

html.className = 'html';
span.innerHTML = rules.join(', ');

if (window !== window.top) {
  html.className += ' is-iframe';
}

for (var i = 0, total = rules.length; i < total; i += 1) {
  var rule = rules[i];
  var otto = new Ottox(rule, width);

  items[i].setAttribute('data-rule', rule);
  boxes.push(otto);
}

window.addEventListener('load', function(e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

