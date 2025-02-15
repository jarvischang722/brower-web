import { cleanDir } from './lib/fs'

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  return Promise.all([
    cleanDir('build/*', {
      nosort: true,
      dot: true,
      ignore: ['build/.git'],
    }),
  ])
}

export default clean
