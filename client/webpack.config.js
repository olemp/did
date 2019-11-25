var path = require('path');
var webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  mode: 'production',
  entry: './lib/App.js',
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  output: {
    path: path.resolve(__dirname, '../public/scripts'),
    filename: 'did365.bundle.js'
  }
};