'use strict';

const postcssNormalize = require('postcss-normalize');

module.exports = [
  {
    test: /\.css$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'),
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixes: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              postcssNormalize,
            ]
          }
        }
      },
    ],
    sideEffects: true,
  },
  {
    test: /\.(scss|sass)$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'),
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixes: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              postcssNormalize,
            ]
          }
        }
      },
      require.resolve('sass-loader'),
    ],
    sideEffects: true,
  }
]