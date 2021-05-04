import React, {
  useEffect,
} from 'react';
import {connect} from 'react-redux';

import {getRooms} from '../actions/rooms.js';
import Room from '../components/Room.jsx';

const Overview = function(props) {
  const {dispatch, rooms, roomStatus} = props;

  useEffect(() => {
    dispatch(getRooms());
  });

  if(rooms.error) {
    return <div className='ui-error'>{rooms.error.message}</div>;
  }

  if(rooms.loading || !rooms.data) {
    return <div className='spinner'>Loading rooms...</div>;
  }

  const renderRoom = room => {
    const status = roomStatus[room.id] || {};

    return (
      <Room key={room.id} config={room} status={status} />
    );
  };

  return (
    <div className='overview'>
      {rooms.data.map(renderRoom)}
    </div>
  );
};

const mapStateToProps = state => ({
  roomStatus: state.roomStatus,
  rooms: state.rooms,
});

export default connect(mapStateToProps)(Overview);
