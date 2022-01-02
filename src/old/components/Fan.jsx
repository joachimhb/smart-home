import _ from 'lodash';
import classNames from 'classnames';
import React, {
  useContext,
  useState,
} from 'react';
import WebsocketConnectionContext from '../contexts/WebsocketConnection';

import humanDate from '../lib/humanDate';

const Fan = function(props) {
  const {config = {}, status = {}, detailed} = props;

  const {value: speedValue, since: speedSince} = status.speed || {};
  const {value: controlValue, since: controlSince} = status.control || {};

  const minHumidityThreshold = _.get(status, ['minHumidityThreshold', 'value'], config.minHumidityThreshold);
  const maxHumidityThreshold = _.get(status, ['maxHumidityThreshold', 'value'], config.maxHumidityThreshold);
  const minRunTime = _.get(status, ['minRunTime', 'value'], config.minRunTime);
  const lightTimeout = _.get(status, ['lightTimeout', 'value'], config.lightTimeout);
  const trailingTime = _.get(status, ['trailingTime', 'value'], config.trailingTime);

  const [_minHumidityThreshold, setMinHumidityThreshold] = useState(minHumidityThreshold);
  const [_maxHumidityThreshold, setMaxHumidityThreshold] = useState(maxHumidityThreshold);
  const [_minRunTime, setMinRunTime]                     = useState(minRunTime);
  const [_lightTimeout, setLightTimeout]                 = useState(lightTimeout);
  const [_trailingTime, setTrailingTime]                 = useState(trailingTime);

  const websocketConnected = useContext(WebsocketConnectionContext);

  const onAutoClick = () => props.onControlChange('auto');
  const onOffClick  = () => props.onSpeedChange('off');
  const onMinClick  = () => props.onSpeedChange('min');
  const onMaxClick  = () => props.onSpeedChange('max');

  const onUpdateConfigClick = () => {
    if(maxHumidityThreshold !== _maxHumidityThreshold) {
      props.onConfigChange('maxHumidityThreshold', _maxHumidityThreshold);
    }
    if(minHumidityThreshold !== _minHumidityThreshold) {
      props.onConfigChange('minHumidityThreshold', _minHumidityThreshold);
    }
    if(minRunTime !== _minRunTime) {
      props.onConfigChange('minRunTime', _minRunTime);
    }
    if(lightTimeout !== _lightTimeout) {
      props.onConfigChange('lightTimeout', _lightTimeout);
    }
    if(trailingTime !== _trailingTime) {
      props.onConfigChange('trailingTime', _trailingTime);
    }
  };

  const updateButtonClasses = [];

  const buttonClasses = [
    'fan__controls__button',
  ];

  if(!websocketConnected) {
    buttonClasses.push('disabled');
  }

  const autoButtonClasses = [
    ...buttonClasses,
    'fan__controls__button--auto',
  ];

  const offButtonClasses = [
    ...buttonClasses,
    'fan__controls__button--off',
  ];

  const minButtonClasses = [
    ...buttonClasses,
    'fan__controls__button--min',
  ];

  const maxButtonClasses = [
    ...buttonClasses,
    'fan__controls__button--max',
  ];

  const renderDetails = () => {
    if(!detailed) {
      return null;
    }

    return (
      <div className='fan__details'>
        <div className='fan__details__control'>[{controlValue}] seit {humanDate(controlSince) || 'unbekannt'}</div>
        <div className='fan__details__control'>[{speedValue}]   seit {humanDate(speedSince) || 'unbekannt'}</div>
        <br />
        <div style={{fontWeight: 'bold'}}>Config:</div>
        <div className='fan__details__config'>
          <div className='fan__details__config__row'>
            <div className='fan__details__config__row__label'>Humidity min: </div>
            <input type='number' value={_minHumidityThreshold} onChange={ev => setMinHumidityThreshold(ev.target.value)} />
            <div className='fan__details__config__row__unit'>%</div>
          </div>
          <div className='fan__details__config__row'>
            <div className='fan__details__config__row__label'>Humidity max: </div>
            <input type='number' value={_maxHumidityThreshold} onChange={ev => setMaxHumidityThreshold(ev.target.value)} />
            <div className='fan__details__config__row__unit'>%</div>
          </div>
          <div className='fan__details__config__row'>
            <div className='fan__details__config__row__label'>Min run time: </div>
            <input type='number' value={_minRunTime} onChange={ev => setMinRunTime(ev.target.value)} />
            <div className='fan__details__config__row__unit'>sek</div>
          </div>
          <div className='fan__details__config__row'>
            <div className='fan__details__config__row__label'>Light timeout: </div>
            <input type='number' value={_lightTimeout} onChange={ev => setLightTimeout(ev.target.value)} />
            <div className='fan__details__config__row__unit'>sek</div>
          </div>
          <div className='fan__details__config__row'>
            <div className='fan__details__config__row__label'>Trailing time: </div>
            <input type='number' value={_trailingTime} onChange={ev => setTrailingTime(ev.target.value)} />
            <div className='fan__details__config__row__unit'>sek</div>
          </div>
          <button disabled={!websocketConnected} className={classNames(updateButtonClasses)} onClick={onUpdateConfigClick}>update</button>
        </div>

      </div>
    );
  };

  return (
    <div className='fan'>
      <div className='fan__header'>
        <div className='fan__header__label'>
          {config.label}
        </div>
        <div className='fan__header__status'>
          <div className={`fan__header__status__control fan__header__status__control--${controlValue}`} title={`Seit: ${controlSince}`}>
            {controlValue}
          </div>
          <div>:</div>
          <div className={`fan__header__status__value  fan__header__status__value--${speedValue}`} title={`Seit: ${speedSince}`}>
            {speedValue}
          </div>
        </div>
      </div>
      <div className='fan__controls'>
        <button disabled={!websocketConnected} className={classNames(autoButtonClasses)} onClick={onAutoClick}>auto</button>
        <button disabled={!websocketConnected} className={classNames(offButtonClasses)}  onClick={onOffClick}>off</button>
        <button disabled={!websocketConnected} className={classNames(minButtonClasses)}  onClick={onMinClick}>min</button>
        <button disabled={!websocketConnected} className={classNames(maxButtonClasses)}  onClick={onMaxClick}>max</button>
      </div>
      {renderDetails()}
    </div>
  );
};

export default Fan;
