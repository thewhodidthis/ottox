const test = require('tape');
const Otto = require('../');

// Get object key by value
// http://stackoverflow.com/questions/9907419/javascript-object-get-key-by-value
const getKeyByValue = (obj, v) => Object.keys(obj).find(key => obj[key] === v);

// https://oeis.org/wiki/Index_to_Elementary_Cellular_Automata
const A000007 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const A000012 = Array(10).fill(1);
const A079978 = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
const A051023 = [1, 1, 0, 1, 1, 1, 0, 0, 1, 1];

// Collect above
const seqs = { A000007, A000012, A051023, A079978 };

// Expected matches
const lookup = {
  30: A051023,
  99: A079978,
  110: A000012,
  210: A000007,
};

// Compares with known integer sequence
test('will compute', (t) => {
  // For each rule in lookup table
  Object.keys(lookup).forEach((rule) => {
    // Get expected sequence
    const series = lookup[rule];

    // Size according to expected sequence
    const size = series.length;

    // Create a new CA
    const toto = Otto({ rule, size });

    // Collect CA flags
    const data = [];

    for (let i = 0; i < size; i += 1) {
      // Tick
      const gen = toto();

      // Only interested in the middle cell
      const mid = gen.length * 0.5;

      // Store
      data.push(gen[mid]);
    }

    // Compare expected sequence with CA data
    t.deepEqual(data, series, `Rule ${rule} matches ${getKeyByValue(seqs, series)}`);
  });

  t.end();
});

// Ignores nonsensical arguments
test('will default', (t) => {
  const toto = Otto(NaN, null);
  const grid = toto();

  t.equal(typeof toto, 'function', 'Returns a function');
  t.ok(grid instanceof Uint8Array, 'Calling returns a typed array');

  t.end();
});

