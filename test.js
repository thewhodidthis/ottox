import { assert, report } from 'tapeless'
import otto from './main.js'

const { ok, equal } = assert

// Get object key by value
// http://stackoverflow.com/questions/9907419/javascript-object-get-key-by-value
const getKeyByValue = (obj, v) => Object.keys(obj).find(key => obj[key] === v)

// https://oeis.org/wiki/Index_to_Elementary_Cellular_Automata
const A000007 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const A000012 = Array(10).fill(1)
const A079978 = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
const A051023 = [1, 1, 0, 1, 1, 1, 0, 0, 1, 1]

// Collect above
const seqs = { A000007, A000012, A051023, A079978 }

// Expected matches
const lookup = { 30: A051023, 99: A079978, 110: A000012, 210: A000007 }

// Compares with known integer sequence
Object.keys(lookup).forEach((rule, j) => {
  // Get expected sequence
  const series = lookup[rule]

  // Size according to expected sequence
  const size = series.length

  // Create a new CA
  const next = otto({ rule, size })

  // Collect CA flags
  const data = []

  for (let i = 0; i < size; i += 1) {
    // Tick
    const gen = next()

    // Only interested in the middle cell
    const mid = gen.length * 0.5

    // Store
    data.push(gen[mid])
  }

  // Add test title
  const head = j ? null : 'will compute'

  // Compare expected sequence with CA data
  equal
    .describe(`Rule ${rule} matches ${getKeyByValue(seqs, series)}`, head)
    .test(JSON.stringify(data), JSON.stringify(series))
})

// Ignores nonsensical arguments
const next = otto(NaN, null)
const grid = next()

equal
  .describe('returns a function', 'will default')
  .test(typeof next, 'function')

ok
  .describe('calling returns a typed array')
  .test(grid instanceof Uint8Array)

report()
