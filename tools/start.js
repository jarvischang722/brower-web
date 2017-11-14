import path from 'path'
import express from 'express'
import browserSync from 'browser-sync'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import createLaunchEditorMiddleware from 'react-error-overlay/middleware'
import run from './run'
import build from './build'
import config from './webpack.config'

const DEBUG = !process.argv.includes('release')

async function start() {
  if (DEBUG) {
    config.entry.app = [
      'react-error-overlay',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
    ]
      .concat(config.entry.app.replace('.js', '.hot.js'))
      .sort((a, b) => b.includes('polyfill') - a.includes('polyfill'))
    config.output.filename = config.output.filename.replace('chunkhash', 'hash')
    config.output.chunkFilename = config.output.chunkFilename.replace('chunkhash', 'hash')
    const { options } = config.module.rules.find(x => x.loader === 'babel-loader')
    options.plugins = ['react-hot-loader/babel', ...(options.plugins || [])]
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }
  const bundler = await run(build, { watching: DEBUG, config })
  const devMiddleware = DEBUG && webpackDevMiddleware(bundler, {
    // IMPORTANT: webpack middleware can't access config,
    // so we should provide publicPath by ourselves
    publicPath: config.output.publicPath,

    quiet: true,

    // Pretty colored output
    stats: config.stats,

    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    }

    // For other settings see
    // https://webpack.github.io/docs/webpack-dev-middleware
  })
  const hotMiddleware = DEBUG && webpackHotMiddleware(bundler)

  const server = express()

  if (DEBUG) server.use(createLaunchEditorMiddleware())
  server.use(express.static(path.join(__dirname, '../build')))
  server.get('*', (req, res, next) => {
    if (!/^\/(assets|__webpack_hmr)/.test(req.url)) {
      res.sendFile(path.resolve(__dirname, '../build/index.html'))
    } else {
      next()
    }
  })
  if (DEBUG) {
    server.use(devMiddleware)
    server.use(hotMiddleware)
  }

  await new Promise((resolve, reject) => {
    browserSync.create().init(
      {
        middleware: [server],

        open: false,

        // files: [
        //   'build/**/*.*',
        // ],
      },
      (err, bs) => (err ? reject(err) : resolve(bs))
    )
  })
}

export default start
