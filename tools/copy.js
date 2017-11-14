import path from 'path'
import chokidar from 'chokidar'
import * as fs from './lib/fs'
import { format } from './run'

async function copy({ watching } = {}) {
  await fs.makeDir('build/assets')

  const promises = [
    fs.copyDir('src/assets/js', 'build/assets'),
    fs.copyDir('src/assets/images', 'build/assets/images'),
    fs.copyFile('src/config.json', 'build/assets/config.json'),
  ]

  await Promise.all(promises)

  if (watching) {
    const watcher = chokidar.watch([
      'src/assets/**/*',
    ], { ignoreInitial: true, ignored: 'src/assets/index.html' })

    watcher.on('all', async (event, filePath) => {
      const start = new Date()
      const src = path.relative('./', filePath)
      const dist = path.join('build/', src.startsWith('src') ? path.relative('src', src) : src)
      switch (event) {
        case 'add':
        case 'change':
          await fs.makeDir(path.dirname(dist))
          await fs.copyFile(filePath, dist)
          break
        case 'unlink':
        case 'unlinkDir':
          fs.cleanDir(dist, { nosort: true, dot: true })
          break
        default:
          return
      }
      const end = new Date()
      const time = end.getTime() - start.getTime()
      console.log(`[${format(end)}] ${event} '${dist}' after ${time} ms`)
    })
  }
}

export default copy
