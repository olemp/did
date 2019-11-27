require('dotenv').config();
const ignorePlugin = require('webpack').IgnorePlugin;

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
  plugins: [
    new ignorePlugin(/^\.\/locale$/, /moment$/),
  ],
  output: {
    path: require('path').resolve(__dirname, './public/js'),
    filename: 'did365.bundle.js'
  }
};