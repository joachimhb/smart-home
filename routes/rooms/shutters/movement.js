'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {shutterMovement} = topics;

module.exports = async function movement({mqttClient, logger}) {
  return {
    method: 'put',
    path: '/rooms/:room/shutters/:shutter/movement',
    fn: async(req, res, next) => {
      try {
        const {room, shutter} = req.params;

        logger.info(`${room} / ${shutter} - movement: ${req.body.value}`);

        await mqttClient.publish(shutterMovement(room, shutter), {value: req.body.value}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
