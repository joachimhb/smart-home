'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {fanMinHumidityThreshold} = topics;

module.exports = async function minHumidityThreshold({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/fans/:fan/minHumidityThreshold',
    fn: async(req, res, next) => {
      try {
        const {room, fan} = req.params;

        await mqttClient.publish(fanMinHumidityThreshold(room, fan), {value: Number(req.body.value)}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
