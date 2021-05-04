'use strict';

module.exports = async function getRoomsConfig({config}) {
  return {
    method: 'get',
    fn: async(req, res) => {
      res.json(config.rooms);
    },
  };
};
