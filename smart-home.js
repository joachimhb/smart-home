'use strict';

const http = require('http');

const _          = require('lodash');
// const fs         = require('fs-extra');
const log4js     = require('log4js');
const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const WebSocket  = require('ws');

const registerRoutes = require('./lib/registerRoutes');
const routes         = require('./routes');

const {
  MqttClient,
  topics,
} = require('@joachimhb/smart-home-shared');

const {
  shutterMovement,
  shutterStatus,
  shutterInit,
  // windowOpenStatus,

  buttonActive,
  windowStatus,

  fanControl,
  fanSpeed,
  fanTrailingTime,
  fanMinRunTime,
  fanLightTimeout,
  fanMinHumidityThreshold,
  fanMaxHumidityThreshold,

  roomTemperature,
  roomHumidity,

  lightStatus,
} = topics;

const {
  port,
  wsPort
} = require('./config');

const logger = log4js.getLogger();

logger.level = 'info';
logger.level = 'debug';

const dockerConfigPath = '../config/smart-home/config';
const localConfigPath = '../smart-home-setup/arbeitszimmer/config/smart-home/config';

let config = null;

try {
  config = require(dockerConfigPath);
  logger.info(`Using config [${dockerConfigPath}]`);
} catch(err) {
  logger.trace('Config fallback', err);
  config = require(localConfigPath);
  logger.info(`Using config [${localConfigPath}]`);
}

const app = express();

app.use(bodyParser.json());
app.set('json spaces', 2);
app.use(express.urlencoded({
  extended: true,
}));

app.use(express.static('dist'));

app.use(morgan('dev'));

const status = {};
const statusHistory = {};

const wss = new WebSocket.Server({port: wsPort});

const clientsBroadcast = function(data) {
  for(const client of wss.clients) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
};

const clientConnected = client => {
  for(const id of Object.keys(status)) {
    const data = {
      type: 'room',
      id,
      status: status[id],
      statusHistory: statusHistory[id] || [],
    };

    client.send(JSON.stringify(data));
  }
};

(async function() {
  const mqttClient = new MqttClient({
    url: config.mqttBroker,
    logger,
  });

  const handleMqttMessage = async(topic, data) => {
    logger.trace('handleMqttMessage', topic, data);

    const [
      area,
      areaId,
      element,
      elementId,
      subArea,
    ] = topic.split('/');

    
    let changeDetected = false;
    
    if(area === 'room') {
      const finalPath = [
        areaId,
        element,
        elementId,
        subArea,
      ].filter(Boolean);

      const current = _.get(status, finalPath, {value: 'unknown'});

      _.set(status, finalPath, data);

      if(current.value !== data.value) {
        logger.debug(topic, current, data);

        changeDetected = true;
      }
    }

    if(changeDetected) {
      const updated = {
        type: 'room',
        id: areaId,
        status: status[areaId],
        statusHistory: statusHistory[areaId] || [],
      };

      clientsBroadcast(updated);
    }
  };

  setInterval(() => {
    // console.log(status);
    for(const areaId of ['bad']) {
      const temperature = _.get(status, [areaId, 'temperature', 'value'], 0);
      const humidity    = _.get(status, [areaId, 'humidity', 'value'], 0);

      statusHistory[areaId] = statusHistory[areaId] || [];

      statusHistory[areaId].push({
        time: new Date().toISOString(),
        temperature,
        humidity,
      });

      // console.log('history', areaId, statusHistory[areaId]);

      while(statusHistory[areaId].length > 60 * 24) {
        statusHistory[areaId].shift();
      }
    }
  }, 10 * 1000);

  await mqttClient.init(handleMqttMessage);

  registerRoutes(app, {mqttClient, logger, config}, routes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err.message);
  });

  const server = http.createServer(app);

  server.on('error', err => {
    logger.error('Server error', err);
  });

  server.listen(port);

  logger.info(`Server started at ${port}`);

  wss.on('connection', client => {
    logger.debug('ws [connection]');

    client.isAlive = true;

    client.on('pong', () => {
      logger.debug('ws [pong]');
      client.isAlive = true;
    });

    client.on('message', data => {
      logger.debug('ws [message]', data);
    });

    logger.debug('ws [open]');

    clientConnected(client);
  });

  const interval = setInterval(() => {
    for(const client of wss.clients) {
      if(client.isAlive === false) {
        return client.terminate();
      }

      client.isAlive = false;
      client.ping(_.noop);
    }
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  for(const room of config.rooms) {
    for(const shutter of room.shutters || []) {
      await mqttClient.subscribe(shutterMovement(room.id, shutter.id));
      await mqttClient.subscribe(shutterStatus(room.id, shutter.id));
      await mqttClient.subscribe(shutterInit(room.id, shutter.id));
    }

    for(const window of room.windows || []) {
      await mqttClient.subscribe(windowStatus(room.id, window.id));
    }

    for(const button of room.buttons || []) {
      await mqttClient.subscribe(buttonActive(room.id, button.id));
    }

    for(const fan of room.fans || []) {
      await mqttClient.subscribe(fanControl(room.id, fan.id));
      await mqttClient.subscribe(fanSpeed(room.id, fan.id));
      await mqttClient.subscribe(fanTrailingTime(room.id, fan.id));
      await mqttClient.subscribe(fanMinRunTime(room.id, fan.id));
      await mqttClient.subscribe(fanMinHumidityThreshold(room.id, fan.id));
      await mqttClient.subscribe(fanMaxHumidityThreshold(room.id, fan.id));
      await mqttClient.subscribe(fanLightTimeout(room.id, fan.id));
    }

    for(const light of room.lights || []) {
      await mqttClient.subscribe(lightStatus(room.id, light.id));
    }

    await mqttClient.subscribe(roomHumidity(room.id));
    await mqttClient.subscribe(roomTemperature(room.id));
  }
})();
