import webpack from 'webpack'
import webpackConfig from './webpack.config'

function bundle({ config } = {}) {
  return new Promise((resolve, reject) => {
    const f = config || webpackConfig
    const bundler = webpack(f)
    const onComplete = async (err, stats) => {
      if (err) return reject(err)
      console.log(stats.toString(f.stats))
      return resolve(bundler)
    }
    bundler.run(onComplete)
  })
}

export default bundle
