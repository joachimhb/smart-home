'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {buttonActive} = topics;

module.exports = async function active({mqttClient, logger}) {
  return {
    method: 'put',
    path: '/rooms/:room/button/:button/active',
    fn: async(req, res, next) => {
      try {
        const {room, button} = req.params;

        logger.info(`${room} / ${button} - active: ${req.body.value}`);

        await mqttClient.publish(buttonActive(room, button), {value: req.body.value}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
