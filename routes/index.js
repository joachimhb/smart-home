'use strict';

const path = require('path');

module.exports = require('require-dir')('.', {
  filter: fullPath => !/^\./.test(path.basename(fullPath)),
  recurse: true,
});
