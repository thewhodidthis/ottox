var Otto = (function () {
  'use strict';

  var Otto = function Otto() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$span = _ref.span,
        span = _ref$span === undefined ? 1 : _ref$span,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 0 : _ref$size,
        _ref$rule = _ref.rule,
        rule = _ref$rule === undefined ? 90 : _ref$rule;

    // Cells
    var _grid = new Uint8Array(size);

    // Lookup table
    var ruleset = rule.toString(2).split('').reverse();

    // Wrap index round edges
    // http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain/1082938#1082938
    var getIndex = function getIndex(a, b) {
      return a - b * Math.floor(a / b);
    };

    // Calculate state
    var getState = function getState(v, i, arr) {
      var state = [];

      // The neighborhood
      for (var j = -span; j <= span; j += 1) {
        var x = getIndex(i + j, arr.length);
        var n = arr[x] || 0;

        state.push(n);
      }

      return ruleset[parseInt(state.join(''), 2)];
    };

    // Flip cell in the middle
    _grid[Math.floor(size * 0.5)] = 1;

    return {
      next: function next() {
        return _grid.set(_grid.map(getState));
      },
      grid: function grid() {
        return _grid;
      }
    };
  };

  return Otto;

}());
//# sourceMappingURL=otto.js.map
