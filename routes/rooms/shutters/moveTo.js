'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {shutterMoveTo} = topics;

module.exports = async function moveTo({mqttClient, logger}) {
  return {
    method: 'put',
    path: '/rooms/:room/shutters/:shutter/moveTo',
    fn: async(req, res, next) => {
      try {
        const {room, shutter} = req.params;

        logger.info(`${room} / ${shutter} - moveTo: ${req.body.value}`);

        await mqttClient.publish(shutterMoveTo(room, shutter), {value: req.body.value});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
