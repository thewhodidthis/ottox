'use strict';

var html = document.documentElement;

var label = document.getElementById('label');
var plots = document.getElementsByTagName('canvas');

var rules = [2123739367, 988197457, 2530535241, 404545713, 1931232828, 2713874006];
var ottos = [];

var framesN = 179;
var frameId;

var frame = function frame() {
  for (var i = 0; i < rules.length; i += 1) {
    var plot = plots[i].getContext('2d');
    var otto = ottos[i];
    var grid = otto();

    for (var j = 0; j < grid.length; j += 1) {
      var x = j % framesN;
      var y = frameId - 1;

      if (grid[j]) {
        plot.fillStyle = 'black';
      } else {
        plot.fillStyle = 'white';
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

label.innerHTML = rules.join(' / ');

rules.forEach((rule, i) => {
  var papa = {
    rule: rule,
    size: framesN,
    ends: [-2, -1, 0, 1, 2],
  };

  var otto = Otto(papa);

  ottos.push(otto);
});

window.addEventListener('load', function(e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

