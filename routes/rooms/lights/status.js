'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {lightStatus} = topics;

module.exports = async function status({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/lights/:light/status',
    fn: async(req, res, next) => {
      try {
        const {room, light} = req.params;

        await mqttClient.publish(lightStatus(room, light), {value: req.body.value}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
