import React from 'react';
import {connect} from 'react-redux';

import {Route, Switch} from 'react-router';
import WebsocketConnectionContext from '../contexts/WebsocketConnection.js';

import Overview from './Overview.jsx';
import Room     from './Room.jsx';

const version = '0.1.1';

const renderGlobalRefresh = connected => {
  if(connected) {
    return null;
  }

  return (
    <div className='smart-home__global-refresh' onClick={() => window.location.reload()}>
      <div className='button' >refresh</div>
    </div>
  ) 
}

const App = function(props) {
  const {smartHome} = props;

  return (
    <WebsocketConnectionContext.Provider value={smartHome.websocketConnection}>
      <div className='smart-home'>
        <div className='header'>
          <div className='header__label'>Smart Home {version}</div>
          {smartHome.websocketConnection === false ? <div className='header__refresh' onClick={() => window.location.reload()}>refresh</div> : null}
          <div className={`header__websocket-connection header__websocket-connection--${String(smartHome.websocketConnection)}`} />
        </div>
        <Switch>
          <Route path='/room/:id' exact={true} component={Room} />
          <Route path='/' component={Overview} />
        </Switch>
        {renderGlobalRefresh(smartHome.websocketConnection !== false)}
      </div>
    </WebsocketConnectionContext.Provider>
  );
};

const mapStateToProps = state => ({
  smartHome: state.smartHome,
});

export default connect(mapStateToProps)(App);
