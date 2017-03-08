var Otto = (function () {
  'use strict';

  // # Otto
  // Helps deal with CAs

  // Wrap index round edges
  // http://stackoverflow.com/questions/1082917/mod-of-negative-number-is-melting-my-brain
  var mod = function mod(a, b) {
    return a - b * Math.floor(a / b);
  };
  var sum = function sum(a, b) {
    return a + b;
  };
  var glu = function glu(a, b, i) {
    return a | b << i;
  };

  var Otto = function Otto() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$rule = _ref.rule,
        rule = _ref$rule === undefined ? 90 : _ref$rule,
        _ref$rows = _ref.rows,
        rows = _ref$rows === undefined ? 1 : _ref$rows,
        _ref$cols = _ref.cols,
        cols = _ref$cols === undefined ? 1 : _ref$cols,
        _ref$span = _ref.span,
        span = _ref$span === undefined ? 1 : _ref$span;

    // Grid size
    var area = rows * cols;

    // The neighborhood, store distance from each neighbor
    var hood = rows > 1 ? [0, cols, -cols, 1, -1] : function (arr) {
      for (var i = 0, max = 1 + 2 * span; i < max; i += 1) {
        arr.push(span - i);
      }

      return arr;
    }([]);

    // Decide type of sum
    var getSum = rows > 1 ? sum : glu;

    // Calculate state
    var getState = function getState(v, i, arr) {
      var state = hood.map(function (diff) {
        var site = mod(diff + i, arr.length);
        var flag = arr[site];

        // Just works :)
        return diff === 0 && flag === 1 && rows > 1 ? hood.length : flag;
      }).reduce(getSum);

      return rule & 1 << state ? 1 : 0;
    };

    // Cells, zero filled
    var memo = new Int8Array(area);

    // Result
    var grid = void 0;

    return function (seed) {
      // Flip cell in middle on init
      memo[seed] = 1;

      return function () {
        // Update
        grid = memo;

        // Save for later
        memo = grid.map(getState);

        // The previous generation
        return grid;
      };
    }(Math.floor(area * 0.5));
  };

  return Otto;

}());
//# sourceMappingURL=otto.js.map
