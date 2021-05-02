import React, {
  useEffect,
} from 'react';
import {connect} from 'react-redux';

import {Route, Switch} from 'react-router';
import {getRooms} from '../actions/rooms.js';
import WebsocketConnectionContext from '../contexts/WebsocketConnection.js';

import Overview from './Overview.jsx';

const version = '0.0.0';

const App = function(props) {
  const {dispatch, rooms, smartHome} = props;

  useEffect(() => {
    dispatch(getRooms());
  });

  if(!rooms.data || rooms.loading) {
    return <div>Loading...</div>;
  }

  return (
    <WebsocketConnectionContext.Provider value={smartHome.websocketConnection}>
      <div className='smart-home'>
        <div className='header'>
          <div className='header__label'>Smart Home {version}</div>
          {smartHome.websocketConnection === false ? <div className='header__refresh' onClick={() => window.location.reload()}>refresh</div> : null}
          <div className={`header__websocket-connection header__websocket-connection--${String(smartHome.websocketConnection)}`} />
        </div>
        <Switch>
          <Route path='/' component={Overview} />
        </Switch>
      </div>
    </WebsocketConnectionContext.Provider>
  );
};

const mapStateToProps = state => ({
  smartHome: state.smartHome,
  rooms: state.rooms,
});

export default connect(mapStateToProps)(App);
