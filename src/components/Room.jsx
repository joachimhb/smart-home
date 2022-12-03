import _ from 'lodash';
import classNames from 'classnames';
import React, {
  useState,
} from 'react';

import Light from './Light.jsx';
import Fan from './Fan.jsx';
import Window from './Window.jsx';
import Shutter from './Shutter.jsx';

import RoomHistoryChart from '../containers/RoomHistoryChart.jsx';

import humanDate from '../lib/humanDate';

import {
  updateShutterMovement,
  updateFanControl,
  updateFanSpeed,
  updateFanConfigValue,
  updateLightStatus,
  updateButtonActive,
  setShutterMoveTo,
} from '../lib/controls';

const Room = function(props) {
  const {
    history,
    config = {}, 
    status = {}, 
    statusHistory, 
    detailed, 
    full
  } = props;

  // console.log(props)

  const [_detailed, setDetailed] = useState(Boolean(detailed));

  const classes = [
    'room',
    `room-${config.id}`,
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

    return (
      <div className='room__general-status__humidity' title={`Seit: ${since || 'unbekannt'}`}>
        <div className='room__general-status__humidity__value'>{value || '-'} %</div>
        {_detailed ? <div className='room__general-status__humidity__since'>seit {humanDate(since) || 'unbekannt'}</div> : null}
      </div>
    );
  }

  const renderHistoryChart = () => {
    if(!full || !['bad', 'schlafzimmer'].includes(config.id)) {
      return null;
    }

    return <RoomHistoryChart id={config.id} />
  }

  const renderGeneralStatus = () => {
    const {temperature, humidity} = status;

    // console.log(config.label, temperature, humidity);

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
      if(config.id === 'schlafzimmer' && !_detailed) {
        continue;
      }

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

    for(const windowConfig of config.windows || []) {
      const {id, shutterId} = windowConfig;

      let shutter = null;

      if(shutterId) {
        const shutterConfig = _.find(config.shutters || [], {id: shutterId});
        const shutterData = _.get(status, ['shutters', shutterId])

        shutter = (
          <Shutter 
            config={shutterConfig}
            data={shutterData}
            onMovementChange={direction => {
              updateShutterMovement(config.id, shutterId, direction);
            }}
            onMoveToSet={value => {
              setShutterMoveTo(config.id, shutterId, value);
            }}
          />
        );
      }

      windowElements.push(
        <Window
          key={id}
          detailed={_detailed}
          config={windowConfig}
          status={_.get(status, ['windows', id, 'status'])}
          shutter={shutter}
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
        {renderHistoryChart()}
      </div>
    );
  };

  // console.log(JSON.stringify({config, status}, null, 2));

  const style = {};

  if([
    'kinderzimmer',
    'arbeitszimmer',
    'schlafzimmer',
  ].includes(config.id)) {
    style.minWidth = '110px';
  }

  return (
    <div className={classNames(classes)} style={style}>
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
