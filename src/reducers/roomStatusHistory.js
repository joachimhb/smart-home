
import {ROOM_STATUS_HISTORY_UPDATE} from '../actions/roomStatusHistory';

const defaultStore = {};

const roomHistory = function(store = defaultStore, action) {
  const {
    type,
    id,
    data,
  } = action;

  if(type === ROOM_STATUS_HISTORY_UPDATE) {
    return {
      ...store,
      [id]: data,
    };
  }

  return store;
};

export default roomHistory;
