'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {fanMaxHumidityThreshold} = topics;

module.exports = async function maxHumidityThreshold({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/fans/:fan/maxHumidityThreshold',
    fn: async(req, res, next) => {
      try {
        const {room, fan} = req.params;

        await mqttClient.publish(fanMaxHumidityThreshold(room, fan), {value: Number(req.body.value)}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
