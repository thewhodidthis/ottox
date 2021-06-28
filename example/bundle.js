(() => {
  // ../main.js
  var myMod = (a, b) => a - b * Math.floor(a / b);
  var parseRule = (rule) => {
    const code = Number(rule).toString(2);
    const zeros = 1024 .toString(2).split("").slice(1).join("");
    const zerosMax = zeros.length;
    const diff = Math.max(zerosMax, zerosMax - code.length);
    return `${zeros}${code}`.substr(diff).split("").reverse();
  };
  var otto = (data) => {
    const papa = Object.assign({
      size: 1,
      rule: 30,
      ends: [-1, 0, 1],
      seed: (v, i, view) => i === Math.floor(view.length * 0.5),
      stat: (hood, code2) => {
        const flags = hood.join("").toString(2);
        const stats = parseInt(flags, 2);
        return code2[stats];
      }
    }, data);
    const code = parseRule(papa.rule);
    const step = (v, i, view) => {
      const hood = papa.ends.map((span) => {
        const site = myMod(span + i, view.length);
        return view[site];
      });
      return papa.stat(hood, code, v);
    };
    let grid = new Uint8Array(papa.size);
    let next = papa.seed;
    return () => {
      grid = grid.map(next);
      next = step;
      return grid;
    };
  };
  var main_default = otto;

  // index.js
  var items = document.getElementsByTagName("li");
  var plots = document.getElementsByTagName("canvas");
  var lines = [];
  var rules = [30, 99, 26, 2713874006, 184, 988197457];
  var size = 180;
  var ends = [-2, -1, 0, 1, 2];
  var seed = () => Math.random() > 0.5;
  var frames = -1;
  var tick = (fn) => window.requestAnimationFrame(fn);
  var stop = (id) => window.cancelAnimationFrame(id);
  var draw = () => {
    for (let i = 0, k = rules.length; i < k; i += 1) {
      const fill = ["black", "white"];
      const plot = plots[i].getContext("2d");
      const next = lines[i];
      const rule = rules[i];
      if (rule < 100) {
        fill.reverse();
      }
      const data = next();
      for (let j = 0, n = data.length; j < n; j += 1) {
        const x = j % size;
        const y = frames - 1;
        if (data[j]) {
          plot.fillStyle = fill[0];
        } else {
          plot.fillStyle = fill[1];
        }
        plot.fillRect(x, y, 1, 1);
      }
    }
    frames = frames > size ? stop(frames) : tick(draw);
  };
  rules.forEach((rule, i) => {
    const item = items[i];
    item.setAttribute("title", rule);
    const data = { rule, size };
    if (rule > 100) {
      data.seed = seed;
    }
    if (rule > 256) {
      data.ends = ends;
    }
    const line = main_default(data);
    lines.push(line);
  });
  window.addEventListener("load", () => {
    frames = tick(draw);
  });
})();
