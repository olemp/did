require('dotenv').config();
const ignorePlugin = require('webpack').IgnorePlugin;
const WebpackBar = require('webpackbar');

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: process.env.NODE_ENV,
  entry: './lib/client/App.js',
  resolve: {
    alias: {
      models: require('path').resolve(__dirname, 'lib/client/models'),
      utils: require('path').resolve(__dirname, 'lib/client/utils'),
      helpers: require('path').resolve(__dirname, 'lib/client/helpers'),
      components: require('path').resolve(__dirname, 'lib/client/components'),
    }
  },
  plugins: [
    new ignorePlugin(/^\.\/locale$/, /moment$/),
    new WebpackBar(),
  ],
  output: {
    path: require('path').resolve(__dirname, './public/js'),
    filename: 'did365.bundle.js'
  }
};