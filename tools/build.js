import run from './run'
import clean from './clean'
import copy from './copy'
import bundle from './bundle'

async function build(options) {
  await run(clean)
  await run(copy, options)
  const r = await run(bundle, options)
  return r
}

export default build
