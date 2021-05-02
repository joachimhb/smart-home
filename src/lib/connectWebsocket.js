import {updateRoomStatus} from '../actions/roomStatus';
import {setWebsocketConnection} from '../actions/smartHome';

const wsHost = 'ws://raspi-arbeitszimmer:3001';

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

      const {type, id, data} = received;

      if(type === 'room_status') {
        store.dispatch(updateRoomStatus(id, data));
      }

      console.log(event);
      // console.log(JSON.stringify({type, id, data}, null, 2));
    } catch(err) {
      console.warn('Websocket', err);
    }
  };
};

export default connectWebsocket;
