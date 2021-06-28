import otto from '../main.js'

const items = document.getElementsByTagName('li')
const plots = document.getElementsByTagName('canvas')

const lines = []
const rules = [30, 99, 26, 2713874006, 184, 988197457]

const size = 180
const ends = [-2, -1, 0, 1, 2]
const seed = () => Math.random() > 0.5

let frames = -1

const tick = fn => window.requestAnimationFrame(fn)
const stop = id => window.cancelAnimationFrame(id)

const draw = () => {
  for (let i = 0, k = rules.length; i < k; i += 1) {
    const fill = ['black', 'white']
    const plot = plots[i].getContext('2d')
    const next = lines[i]
    const rule = rules[i]

    if (rule < 100) {
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

  item.setAttribute('title', rule)

  const data = { rule, size }

  if (rule > 100) {
    data.seed = seed
  }

  if (rule > 256) {
    data.ends = ends
  }

  const line = otto(data)

  lines.push(line)
})

window.addEventListener('load', () => {
  frames = tick(draw)
})
