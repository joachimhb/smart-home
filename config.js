'use strict';

const overWrite = {
  // port: 3300,
  // wsPort: 3301,
}

const config = {
  // port: 3010,
  // wsPort: 3011,

  port: 3000,
  wsPort: 3001,

  ...overWrite,
};

module.exports = config;
