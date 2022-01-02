'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {
  shutterUp,
  shutterDown,
  shutterStop,
} = topics;

module.exports = async function movement({mqttClient, logger}) {
  return {
    method: 'put',
    path: '/rooms/:room/shutters/:shutter/movement',
    fn: async(req, res, next) => {
      try {
        const {room, shutter} = req.params;

        logger.info(`${room} / ${shutter} - movement: ${req.body.value}`);

        if(req.body.value === 'up') {
          await mqttClient.publish(shutterUp(room, shutter), {value: req.body.value});
        } else if(req.body.value === 'down') {
          await mqttClient.publish(shutterDown(room, shutter), {value: req.body.value});
        } else if(req.body.value === 'stop') {
          await mqttClient.publish(shutterStop(room, shutter), {value: req.body.value});
        }

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
