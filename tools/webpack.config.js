import path from 'path'
import webpack from 'webpack'
import AssertsPlugin from 'assets-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import pkg from '../package.json'

const DEBUG = !process.argv.includes('release')
const VERBOSE = process.argv.includes('verbose')
const ANALYZE = process.argv.includes('analyze') || process.argv.includes('analyse')

const config = {
  context: path.resolve(__dirname, '../src'),

  entry: {
    app: './index.js'
  },

  output: {
    filename: DEBUG ? '[name].js' : '[name].[chunkhash:5].js',
    chunkFilename: DEBUG ? '[name].chunk.js' : '[name].[chunkhash:5].chunk.js',
    path: path.resolve(__dirname, '../build/assets'),
    publicPath: '/assets/',
    pathinfo: VERBOSE,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src'),
        ],
        options: {
          cacheDirectory: DEBUG,
          babelrc: false,
          presets: [
            'stage-1',
            'react',
            ['env', {
              targets: {
                browsers: pkg.browserslist,
                uglify: true,
              },
              modules: false,
              useBuiltIns: false,
              debug: false,
            }],
            'react-optimize',
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            ...DEBUG ? [
              'transform-react-jsx-source',
              'transform-react-jsx-self',
            ] : [],
            // ['import', { libraryName: 'antd', style: 'css' }],
          ],
        },
      },
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: DEBUG,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: DEBUG ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              // CSS Nano http://cssnano.co/options/
              minimize: !DEBUG,
              discardComments: { removeAll: true },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './tools/postcss.config.js',
              },
            },
          },
        ],
      },
      // {
      //   test: /antd.*\.css/,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         // CSS Loader https://github.com/webpack/css-loader
      //         importLoaders: 1,
      //         sourceMap: DEBUG,
      //         // CSS Nano http://cssnano.co/options/
      //         minimize: !DEBUG,
      //         discardComments: { removeAll: true },
      //       },
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         config: {
      //           path: './tools/postcss.config.js',
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: DEBUG ? 'images/[name].[ext]?[hash:8]' : 'images/[hash:8].[ext]',
        },
      },
      {
        test: /\.(eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: DEBUG ? 'fonts/[name].[ext]?[hash:8]' : 'fonts/[hash:8].[ext]',
        },
      },
    ],
  },

  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },

  bail: !DEBUG,

  cache: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    modules: VERBOSE,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  target: 'web',

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    redux: 'Redux',
    'react-redux': 'ReactRedux',
    moment: 'moment',
    antd: 'antd',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: DEBUG,
    }),
    new HtmlWebpackPlugin({
      template: DEBUG ? './assets/index.dev.html' : './assets/index.html',
      filename: '../index.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
    new AssertsPlugin({
      path: path.resolve(__dirname, '../build'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks: module => module.resource && /node_modules/.test(module.resource)
    }),
    // new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    ...DEBUG ? [] : [
      // Decrease script evaluation time
      // https://github.com/webpack/webpack/blob/master/examples/scope-hoisting/README.md
      new webpack.optimize.ModuleConcatenationPlugin(),

      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: VERBOSE,
          unused: true,
          dead_code: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ],

    // Webpack Bundle Analyzer
    // https://github.com/th0r/webpack-bundle-analyzer
    ...ANALYZE ? [new BundleAnalyzerPlugin()] : [],
  ],

  devtool: DEBUG ? 'cheap-module-source-map' : false,

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}

export default config
