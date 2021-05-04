// 'http://raspi-arbeitszimmer/api/'
const apiBase = '/api/';

import client from './client';

export const updateShutterMovement = async(room, shutter, value) => {
  const url = `${apiBase}rooms/${room}/shutters/${shutter}/movement`;

  await client.put(url, {value});
};

export const updateFanControl = async(room, fan, value) => {
  const url = `${apiBase}rooms/${room}/fans/${fan}/control`;

  await client.put(url, {value});
};

export const updateFanSpeed = async(room, fan, value) => {
  const url = `${apiBase}rooms/${room}/fans/${fan}/speed`;

  await client.put(url, {value});
};

export const updateFanConfigValue = async(room, fan, configKey, value) => {
  const url = `${apiBase}rooms/${room}/fans/${fan}/${configKey}`;

  await client.put(url, {value});
};

export const updateLightStatus = async(room, light, value) => {
  const url = `${apiBase}rooms/${room}/lights/${light}/status`;

  await client.put(url, {value});
};
