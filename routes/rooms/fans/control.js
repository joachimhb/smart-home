'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {fanControl} = topics;

module.exports = async function control({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/fans/:fan/control',
    fn: async(req, res, next) => {
      try {
        const {room, fan} = req.params;

        await mqttClient.publish(fanControl(room, fan), {value: req.body.value}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
