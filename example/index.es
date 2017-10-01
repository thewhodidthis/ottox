import calculate from '../index.mjs'

const items = document.getElementsByTagName('li')
const plots = document.getElementsByTagName('canvas')

const lines = []
const rules = [30, 99, 210, 2123739367, 988197457, 2713874006]

const size = 180
const ends = [-2, -1, 0, 1, 2]

let frames = -1

const tick = fn => window.requestAnimationFrame(fn)
const stop = id => window.cancelAnimationFrame(id)

const draw = () => {
  for (let i = 0, k = rules.length; i < k; i += 1) {
    const fill = ['black', 'white']
    const plot = plots[i].getContext('2d')
    const next = lines[i]

    if (rules[i] < 256) {
      fill.reverse()
    }

    const data = next()

    for (let j = 0, n = data.length; j < n; j += 1) {
      const x = j % size
      const y = frames - 1

      if (data[j]) {
        plot.fillStyle = fill[0]
      } else {
        plot.fillStyle = fill[1]
      }

      plot.fillRect(x, y, 1, 1)
    }
  }

  frames = frames > size ? stop(frames) : tick(draw)
}

rules.forEach((rule, i) => {
  const item = items[i]

  item.setAttribute('data-rule', rule)

  const data = { rule, size }
  const papa = rule < 256 ? data : Object.assign({ ends }, data)
  const line = calculate(papa)

  lines.push(line)
})

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

window.addEventListener('load', () => {
  frames = tick(draw)
})
