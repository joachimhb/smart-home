export const ROOM_STATUS_HISTORY_UPDATE = 'ROOM_STATUS_HISTORY_UPDATE';

export const updateRoomStatusHistory = (id, data) => dispatch => {
  dispatch({
    type: ROOM_STATUS_HISTORY_UPDATE,
    id,
    data,
  });
};