import _ from 'lodash';
import classNames from 'classnames';
import React, {
  useState,
} from 'react';

import Light from './Light.jsx';
import Fan from './Fan.jsx';
import Window from './Window.jsx';

import {updateShutterMovement} from '../lib/controls';

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

    const lightElements = [];

    for(const light of config.lights || []) {
      lightElements.push(<Light key={light.id} config={light} status={_.get(status, ['lights', light.id])} />);
    }

    return (
      <div className='room__general-status'>
        <div className='room__general-status__line'>
          <div className='room__general-status__temperature' title={`Seit ${temperatureSince}`}>{temperatureValue || '-'} C</div>
          <div>/</div>
          <div className='room__general-status__humidity' title={`Seit ${humiditySince}`}>{humidityValue || '-'} %</div>
        </div>
        <div className='room__general-status__line'>
          {lightElements}
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
          config={fan}
          status={_.get(status, ['fans', fan.id])}
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

    return (
      <div className='room__status'>
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
        <div className='room__header__label'>{config.label}</div>
        {renderGeneralStatus()}
      </div>
      {renderStatus()}
    </div>
  );
};

export default Room;
