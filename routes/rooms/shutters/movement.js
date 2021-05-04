'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {shutterMovement} = topics;

module.exports = async function movement({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/shutters/:shutter/movement',
    fn: async(req, res, next) => {
      try {
        const {room, shutter} = req.params;

        await mqttClient.publish(shutterMovement(room, shutter), {value: req.body.value}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
