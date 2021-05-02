import React from 'react';
import {connect} from 'react-redux';

import Room from '../components/Room.jsx';

const Overview = function(props) {
  const {roomStatus, rooms} = props;

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
