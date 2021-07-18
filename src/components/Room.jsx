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
  const {
    history,
    config = {}, 
    status = {}, 
    detailed, 
    full
  } = props;

  const [_detailed, setDetailed] = useState(Boolean(detailed));

  const classes = [
    'room',
  ];

  if(_detailed) {
    classes.push('room--detailed');
  }
  if(full) {
    classes.push('room--full');
  }

  const renderTemperature = temperature => {
    const {value, since} = temperature;

    if(!value) {
      return null;
    }

    const finalTemperature = value ? value.toFixed(1) : '-';

    return (
      <div className='room__general-status__temperature' title={`Seit: ${since || 'unbekannt'}`}>
        <div className='room__general-status__temperature__value'>{finalTemperature || '-'} C</div>
        {_detailed ? <div className='room__general-status__temperature__since'>seit {humanDate(since) || 'unbekannt'}</div> : null}
      </div>
    );
  }

  const renderHumidity = humidity => {
    const {value, since} = humidity;

    if(!value) {
      return null;
    }

    const finalHumidity = value ? value.toFixed(1) : '-';

    return (
      <div className='room__general-status__humidity' title={`Seit: ${since || 'unbekannt'}`}>
        <div className='room__general-status__humidity__value'>{finalHumidity || '-'} %</div>
        {_detailed ? <div className='room__general-status__humidity__since'>seit {humanDate(since) || 'unbekannt'}</div> : null}
      </div>
    );
  }

  const renderGeneralStatus = () => {
    const {temperature, humidity} = status;

    console.log(config.label, temperature, humidity);

    return (
      <div className='room__general-status'>
        {renderTemperature(temperature || {})}
        {renderHumidity(humidity || {})}
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
      {full ? <div className='overview-link' onClick={() => history.push(`/`)}>zurueck</div> : null}
      <div className='room__header'>
        <div className='room__header__label' onClick={() => setDetailed(!_detailed)}>{config.label}</div>
        {renderGeneralStatus()}
      </div>
      {renderStatus()}
      {full ? null : <div className='room-link' onClick={() => history.push(`/room/${config.id}`)}>details</div>}
    </div>
  );
};

export default Room;
