import React, {
  useEffect,
} from 'react';
import {connect} from 'react-redux';

import {getRooms} from '../actions/rooms.js';
import Room from '../components/Room.jsx';

const RoomFullSize = function(props) {
  const {dispatch, rooms, roomStatus = {}, roomStatusHistory = {}, history, match} = props;

  // console.log({roomStatusHistory});
  
  const id = match.params.id;

  useEffect(() => {
    dispatch(getRooms());
  });

  if(rooms.error) {
    return <div className='ui-error'>{rooms.error.message}</div>;
  }

  if(rooms.loading || !rooms.data) {
    return <div className='spinner'>Loading rooms...</div>;
  }

  const room          = _.find(rooms.data, {id});
  const status        = roomStatus[id] || {};
  const statusHistory = roomStatusHistory[id];

  // console.log('RoomFullSize', {status, statusHistory});

  if(!room) {
    return <div>Room {id} not found</div>
  }

  return (
    <Room key={id} config={room} status={status} statusHistory={statusHistory} full={true} history={history} />
  );
};

const mapStateToProps = state => ({
  roomStatusHistory: state.roomStatusHistory,
  roomStatus: state.roomStatus,
  rooms: state.rooms,
});

export default connect(mapStateToProps)(RoomFullSize);
