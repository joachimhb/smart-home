'use strict';

const {
  topics,
} = require('@joachimhb/smart-home-shared');

const {fanLightTimeout} = topics;

module.exports = async function lightTimout({mqttClient}) {
  return {
    method: 'put',
    path: '/rooms/:room/fans/:fan/lightTimeout',
    fn: async(req, res, next) => {
      try {
        const {room, fan} = req.params;

        await mqttClient.publish(fanLightTimeout(room, fan), {value: Number(req.body.value)}, {retain: true});

        res.json({handled: true});
      } catch(err) {
        return next(err);
      }
    },
  };
};
