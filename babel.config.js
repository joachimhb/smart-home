'use strict';

module.exports = {
  presets: [
    '@babel/react',
    '@babel/env',
  ],
  plugins: [
    '@babel/syntax-dynamic-import',
    'react-hot-loader/babel',
  ],
};
