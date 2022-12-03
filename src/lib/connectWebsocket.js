import {updateRoomStatus}        from '../actions/roomStatus';
import {setWebsocketConnection}  from '../actions/smartHome';

import {wsPort} from '../../config';

const wsHost = `ws://raspi-arbeitszimmer:${wsPort}`;

const connectWebsocket = function({store}) {
  const ws = new WebSocket(wsHost);

  ws.onopen = function() {
    store.dispatch(setWebsocketConnection(true));
  };

  ws.onclose = function() {
    store.dispatch(setWebsocketConnection(false));
  };

  // setInterval(() => {
  //   console.log(ws.readyState);

  // }, 1000);

  ws.onmessage = function(event) {
    try {
      const received = JSON.parse(event.data);

      const {type, id, status, statusHistory} = received;

      // console.log(id, data);

      if(type === 'room') {
        store.dispatch(updateRoomStatus(id, status));
      }

      // console.log(event);
      // console.log(JSON.stringify({type, id, status, statusHistory}, null, 2));
    } catch(err) {
      console.warn('Websocket', err);
    }
  };
};

export default connectWebsocket;
