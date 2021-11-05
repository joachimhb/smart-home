'use strict';

const path    = require('path');
const webpack = require('webpack');

const styleLoaders = require('./styleLoaders');

const {
  port,
} = require('./config');

const devPort = port + 2;

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
    // contentBase: path.join(__dirname, 'public/'),
    port: devPort,
    host: '0.0.0.0',
    hot: true,
    // publicPath: `http://0.0.0.0:${devPort}/public/`,
    // hotOnly: true,
    proxy: {
      '/api': `http://0.0.0.0:${port}`,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
