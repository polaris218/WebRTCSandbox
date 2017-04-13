'use strict'

const webpack = require('webpack')

module.exports = {
  watch: true,
  devtool: 'source-map',
  entry: {
    app: './src/js/app.js'
  },
  output: {
    path: __dirname + 'build/',
    publicPath: '/js',
    filename: 'app.js',
    libraryTarget: 'var',
    library: 'app'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }]
      }
    ]
  }
}
