// 'http://raspi-arbeitszimmer/api/'
const apiBase = '/api/';

import client from './client';

export const updateShutterMovement = async(room, shutter, value) => {
  const url = `${apiBase}rooms/${room}/shutters/${shutter}/movement`;

  await client.put(url, {value});
};

