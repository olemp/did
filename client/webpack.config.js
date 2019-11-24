var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './lib/App.js',
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  output: {
    path: path.resolve(__dirname, '../public/scripts'),
    filename: 'App.js'
  }
};