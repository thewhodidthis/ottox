'use strict';

var html = document.documentElement;

var items = document.getElementsByTagName('li');
var plots = document.getElementsByTagName('canvas');

var rules = [30, 99, 210, 110, 118, 182];
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

rules.forEach((rule, i) => {
  var papa = {
    rule: rule,
    size: framesN,
  };

  var otto = Otto(papa);

  items[i].setAttribute('data-rule', rule);
  ottos.push(otto);
});

window.addEventListener('load', function (e) {
  frameId = window.requestAnimationFrame(frame);
}, false);

