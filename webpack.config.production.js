'use strict';

const path = require('path');

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
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader')
        ],
        sideEffects: true,
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          require.resolve('sass-loader'),
        ],
        sideEffects: true,
      }
    ]
  },
  resolve: {extensions: ['*', '.js', '.jsx']},
  output: {
    path: path.resolve(__dirname, 'dist/'),
    // publicPath: '/public/',
    filename: 'bundle.js'
  },
};
