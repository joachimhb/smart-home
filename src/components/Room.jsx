import _ from 'lodash';
import classNames from 'classnames';
import React, {
  useState,
} from 'react';

import Light from './Light.jsx';
import Fan from './Fan.jsx';
import Window from './Window.jsx';

import humanDate from '../lib/humanDate';

import {
  updateShutterMovement,
  updateFanControl,
  updateFanSpeed,
  updateFanConfigValue,
  updateLightStatus,
} from '../lib/controls';

const Room = function(props) {
  const {config = {}, status = {}, detailed} = props;

  const [_detailed, setDetailed] = useState(Boolean(detailed));

  const classes = [
    'room',
  ];

  if(_detailed) {
    classes.push('room--detailed');
  }

  const renderGeneralStatus = () => {
    const {temperature, humidity} = status;

    const {value: temperatureValue, since: temperatureSince} = temperature || {};
    const {value: humidityValue, since: humiditySince} = humidity || {};

    const finalTemperature = temperatureValue ? temperatureValue.toFixed(1) : '-';
    const finalHumidity = humidityValue ? humidityValue.toFixed(1) : '-';

    return (
      <div className='room__general-status'>
        <div className='room__general-status__temperature' title={`Seit: ${temperatureSince || 'unbekannt'}`}>
          <div className='room__general-status__temperature__value'>{finalTemperature || '-'} C</div>
          {_detailed ? <div className='room__general-status__temperature__since'>seit {humanDate(temperatureSince) || 'unbekannt'}</div> : null}
        </div>
        <div className='room__general-status__humidity' title={`Seit: ${humiditySince || 'unbekannt'}`}>
          <div className='room__general-status__humidity__value'>{finalHumidity || '-'} %</div>
          {_detailed ? <div className='room__general-status__humidity__since'>seit {humanDate(humiditySince) || 'unbekannt'}</div> : null}
        </div>
      </div>
    );
  };

  const renderStatus = () => {
    const fanElements = [];
    const windowElements = [];

    for(const fan of config.fans || []) {
      fanElements.push(
        <Fan
          key={fan.id}
          detailed={_detailed}
          config={fan}
          status={_.get(status, ['fans', fan.id])}
          onControlChange={value => {
            updateFanControl(config.id, fan.id, value);
          }}
          onSpeedChange={value => {
            updateFanSpeed(config.id, fan.id, value);
          }}
          onConfigChange={(key, value) => {
            updateFanConfigValue(config.id, fan.id, key, value);
          }}
        />
      );
    }

    const finalWindowIds = _.uniq(_.map([...config.windows || [], ...config.shutters || []], 'id'));

    for(const id of finalWindowIds) {
      const shutterConfig = _.find(config.windows || [], {id});
      const windowConfig =  _.find(config.shutters || [], {id});

      windowElements.push(
        <Window
          key={id}
          detailed={_detailed}
          shutterConfig={shutterConfig}
          windowConfig={windowConfig}
          windowStatus={_.get(status, ['windows', id])}
          shutterStatus={_.get(status, ['shutters', id])}
          onMovementChange={direction => {
            updateShutterMovement(config.id, id, direction);
          }}
        />
      );
    }

    const lightElements = [];

    for(const light of config.lights || []) {
      lightElements.push(
        <Light
          key={light.id}
          detailed={_detailed}
          config={light}
          status={_.get(status, ['lights', light.id, 'status'])}
          onChange={value => {
            updateLightStatus(config.id, light.id, value);
          }}
        />
      );
    }

    return (
      <div className='room__status'>
        <div className='room__status__lights'>
          {lightElements}
        </div>
        <div className='room__status__fans'>
          {fanElements}
        </div>
        <div className='room__status__windows'>
          {windowElements}
        </div>
      </div>
    );
  };

  // console.log(JSON.stringify({config, status}, null, 2));

  return (
    <div className={classNames(classes)}>
      <div className='room__header'>
        <div className='room__header__label' onClick={() => setDetailed(!_detailed)}>{config.label}</div>
        {renderGeneralStatus()}
      </div>
      {renderStatus()}
    </div>
  );
};

export default Room;
