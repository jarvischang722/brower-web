export function format(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
}

function run(fn, options) {
  const task = typeof fn.default === 'undefined' ? fn : fn.default
  const start = new Date()
  let paramsStr = ''
  if (options) {
    const params = []
    const { watching, config } = options
    if (watching) params.push('watching')
    if (config) params.push('config')
    paramsStr = params.length === 0 ? '' : `(${params.join(', ')})`
  }
  console.log(
    `[${format(start)}] Starting '${task.name}${paramsStr}'...`
  )
  return task(options).then((stat) => {
    const end = new Date()
    const time = end.getTime() - start.getTime()
    console.log(
      `[${format(end)}] Finished '${task.name}${paramsStr}' after ${time} ms`
    )
    return stat
  })
}

if (process.mainModule.children.length === 0 && process.argv.length > 2) {
  delete require.cache[__filename] // eslint-disable-line no-underscore-dangle
  const module = require(`./${process.argv[2]}.js`).default // eslint-disable-line import/no-dynamic-require
  run(module).catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
}

export default run
