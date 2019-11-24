var path = require('path');
var webpack = require('webpack');
var mode = process.env.NODE_ENV.trim();

module.exports = {
  mode: mode,
  entry: './lib/App.js',
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  output: {
    path: path.resolve(__dirname, '../public/scripts'),
    filename: 'App.js'
  }
};