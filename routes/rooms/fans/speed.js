'use strict';

const delay = require('delay');

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {
  fanControl,
  fanSpeed,
} = topics;

module.exports = async function speed({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/fans/:fan/speed',
    fn: async(req, res, next) => {
      try {
        const {room, fan} = req.params;

        await mqttClient.publish(fanControl(room, fan), {value: 'manual'}, {retain: true});
        await delay(500);
        await mqttClient.publish(fanSpeed(room, fan), {value: req.body.value}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
