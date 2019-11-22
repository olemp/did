var path = require('path');

module.exports = {
  mode: 'production',
  entry: './lib/App.js',
  output: {
    path: path.resolve(__dirname, '../Scripts'),
    filename: 'App.js'
  }
};