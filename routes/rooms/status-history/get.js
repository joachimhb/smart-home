'use strict';

module.exports = async function history({getHistoryData}) {
  return {
    method: 'get',
    path: '/room-status-history/:room',
    fn: async(req, res, next) => {
      try {
        const {room} = req.params;

        res.json(getHistoryData(room));
      } catch(err) {
        return next(err);
      }
    },
  };
};
