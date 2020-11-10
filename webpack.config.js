/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const tryRequire = require('try-require')
const { resolve } = require('path')
const { name, version } = require('./package.json')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const LiveReloadPlugin = tryRequire('webpack-livereload-plugin')
const WebpackBuildNotifierPlugin = tryRequire('webpack-build-notifier')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const debug = require('debug')('webpack')

/** CONSTANTS */
const MODE = process.env.NODE_ENV === 'development' ? 'development' : 'production'
const IS_DEVELOPMENT = MODE === 'development'
const SERVER_DIST = IS_DEVELOPMENT ? 'server' : 'server-dist'
const BUNDLE_FILE_NAME = `[name].${version}.[hash].js`
const HTML_PLUGIN_FILE_NAME = resolve(__dirname, 'server/views/@template.hbs')
const SRC_PATH = resolve(__dirname, 'client/')

/** PRINTING HEADER */
debug('Compiling Did bundle')
debug('[MODE]: %s', MODE.toUpperCase())
debug('[SERVER DIST]: %s', SERVER_DIST.toUpperCase())
debug('[FILENAME]: %s', BUNDLE_FILE_NAME)
debug('[HBS TEMPLATE]: %s', HTML_PLUGIN_FILE_NAME)

/** CONFIG */
const config = {
  mode: MODE,
  entry: { [name]: './client' },
  output: {
    path: resolve(__dirname, SERVER_DIST, 'public/js'),
    filename: BUNDLE_FILE_NAME,
    publicPath: '/js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-modules-typescript-loader' },
          { loader: 'css-loader', options: { modules: { auto: true } } },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
    ],
  },
  resolve: {
    alias: {
      common: resolve(SRC_PATH, 'common'),
      types: resolve(SRC_PATH, 'types'),
      utils: resolve(SRC_PATH, 'utils'),
      helpers: resolve(SRC_PATH, 'helpers'),
      pages: resolve(SRC_PATH, 'pages'),
      components: resolve(SRC_PATH, 'components'),
      i18n: resolve(SRC_PATH, 'i18n'),
      config: resolve(SRC_PATH, 'config'),
      AppContext: resolve(SRC_PATH, 'AppContext'),
      'office-ui-fabric': resolve(SRC_PATH, 'office-ui-fabric'),
    },
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.css',
      '.scss',
      '.gql'
    ],
    plugins: [new TsconfigPathsPlugin({ configFile: './client/tsconfig.json' })]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: HTML_PLUGIN_FILE_NAME,
      filename: resolve(__dirname, SERVER_DIST, 'views/index.hbs'),
      inject: true,
    }),
  ],
}

if (IS_DEVELOPMENT) {
  config.stats = 'normal'
  config.watch = true
  config.watchOptions = { aggregateTimeout: 250 }
  config.plugins.push(
    new LiveReloadPlugin(),
    new WebpackBuildNotifierPlugin({
      logo: resolve(__dirname, '/server/public/images/favicon/mstile-150x150.png'),
      sound: process.env.WEBPACK_NOTIFICATIONS_SOUND,
      suppressSuccess: process.env.WEBPACK_NOTIFICATIONS_SUPPRESSSUCCESS === 'true',
      showDuration: process.env.WEBPACK_NOTIFICATIONS_SHOWDURATION === 'true',
    }),
    new BundleAnalyzerPlugin({ analyzerMode: process.env.BUNDLE_ANALYZER_MODE })
  )
} else {
  config.stats = 'errors-only'
  config.plugins.push(new CompressionPlugin())
}

module.exports = config
