'use strict';

const path    = require('path');
const webpack = require('webpack');

const styleLoaders = require('./styleLoaders');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {presets: ['@babel/env']}
      },
      ...styleLoaders,
    ]
  },
  resolve: {extensions: ['*', '.js', '.jsx']},
  output: {
    path: path.resolve(__dirname, 'public/'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: 3002,
    host: '0.0.0.0',
    publicPath: 'http://0.0.0.0:3002/public/',
    hotOnly: true,
    proxy: {
      '/api': 'http://0.0.0.0:3000',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
