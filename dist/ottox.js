var Ottox = (function () {
  'use strict';

  function Ottox() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var settings = Object.assign({}, Ottox.defaults, options);

    if (typeof options === 'number') {
      settings.rule = parseInt(options, 10);
    }

    if (size !== null && typeof size === 'number') {
      settings.size = parseInt(size, 10);
    }

    // Generation
    this.zoom = Math.max(parseInt(settings.zoom, 10), 0);

    // Cells array
    this.grid = new Uint8Array(settings.size);

    // Rule byte string
    this.rule = this.parseRule(settings.rule);

    // Flip cell in the middle
    this.flip(settings.size * 0.5);
  }

  Ottox.prototype = {
    constructor: Ottox,

    flip: function flip(x) {
      var index = parseInt(x, 10);

      this.grid[index] = !this.grid[index];
    },
    next: function next(prev) {
      var grid = prev && prev.length ? prev : this.grid;
      var size = grid.length;
      var next = new Uint8Array(size);

      for (var i = 0; i < size; i += 1) {
        var l = i - 1 >= 0 ? grid[i - 1] : grid[0];
        var c = grid[i];
        var r = i + 1 <= grid.length - 1 ? grid[i + 1] : grid[grid.length - 1];

        next[i] = this.getState(l, c, r);
      }

      this.zoom = this.zoom + 1;
      this.grid = next;

      return next;
    },
    getState: function getState(l, c, r) {
      return this.rule[parseInt('' + l + c + r, 2)];
    },
    setRule: function setRule(target) {
      this.rule = this.parseRule(target);
    },
    parseRule: function parseRule(target) {
      var output = target.toString(2);

      // http://stackoverflow.com/questions/9909038/formatting-hexadecimal-number-in-javascript
      return ('000000000' + output).substr(-8).split('').reverse();
    }
  };

  Ottox.defaults = {
    zoom: 0,
    rule: 90,
    size: 10
  };

  return Ottox;

}());
//# sourceMappingURL=ottox.js.map
