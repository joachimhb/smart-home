import classNames from 'classnames';
import _ from 'lodash';

import React, {
  useContext,
} from 'react';
import WebsocketConnectionContext from '../contexts/WebsocketConnection';
import humanDate from '../lib/humanDate';

const Window = function(props) {
  const {
    windowConfig = {}, 
    shutterConfig = {}, 
    buttonConfig = {}, 
    
    windowStatus = {}, 
    shutterStatus = {}, 
    buttonStatus = {}, 
    detailed
  } = props;

  const {value: windowValue, since: windowSince}             = windowStatus.status || {};
  const {since: initSince}                                   = shutterStatus.init || {};
  const {value: statusValue, since: statusSince}             = shutterStatus.status || {};
  const {value: movementValue, since: movementSince}         = shutterStatus.movement || {};
  const {value: buttonActiveValue, since: buttonActiveSince} = buttonStatus.active || {};

  const websocketConnected = useContext(WebsocketConnectionContext);

  const onUpClick     = () => props.onMovementChange('up');
  const onStopClick   = () => props.onMovementChange('stop');
  const onDownClick   = () => props.onMovementChange('down');
  // const onFixedClick  = value => props.onFixedStatus(value);
  const onSwitchClick = () => props.onButtonActiveChange(!buttonActiveValue);

  let windowHumanValue = null;

  if(!_.isNil(windowValue)) {
    windowHumanValue = windowValue === 'open' ? 'offen' : 'geschlossen';
  }

  let buttonHumanValue = null;

  if(!_.isNil(buttonActiveValue)) {
    buttonHumanValue = buttonActiveValue === false ? 'inaktiv' : 'aktiv';
  }

  const renderOpenStatus = () => {
    if(!windowConfig.id) {
      return null;
    }

    if(!windowHumanValue) {
      return null;
    }

    return (
      <div className='window__open-status' title={`Seit: ${windowSince}`}>{windowHumanValue}</div>
    );
  };

  const buttonClasses = [
    'window__shutter__controls__button',
  ];

  if(!websocketConnected) {
    buttonClasses.push('disabled');
  }

  const upButtonClasses = [
    ...buttonClasses,
    'window__shutter__controls__button--up',
    movementValue === 'up' ? 'active' : '',
  ];

  const stopButtonClasses = [
    ...buttonClasses,
    'window__shutter__controls__button--stop',
    movementValue === 'stop' ? 'active' : '',
  ];

  const downButtonClasses = [
    ...buttonClasses,
    'window__shutter__controls__button--down',
    movementValue === 'down' ? 'active' : '',
  ];

  const activeButtonClasses = [
    ...buttonClasses,
    'window__shutter__controls__button--active',
    buttonActiveValue === false ? 'inactive' : 'active',
  ];

  const renderAdditionalControls = () => {
    const additionalControls = [
      // <button key='40' disabled={!websocketConnected} className={classNames(buttonClasses)} onClick={() => onFixedClick(40)}>
      //     40
      // </button>,
      // <button key='80' disabled={!websocketConnected} className={classNames(buttonClasses)} onClick={() => onFixedClick(80)}>
      //     80
      // </button>,
    ];  
  
    if(buttonConfig.id) {
      additionalControls.unshift(
        <button key='button-active' disabled={!websocketConnected} className={classNames(activeButtonClasses)} onClick={onSwitchClick}>
          L
        </button>
      )
    }
  
    return (
      <div className='window__shutter__controls'>
        {additionalControls}
      </div>
    );
  }

  const renderShutter = () => {
    if(!shutterConfig.id) {
      return null;
    }
    
    return (
      <div className='window__shutter'>
        <div className='window__shutter__status' title={`Seit: ${statusSince}`}>
          <div className='window__shutter__status__value' style={{height: `${statusValue}%`}} />
        </div>
        <div className='window__shutter__controls' title={`Seit: ${movementSince}`}>
          <button disabled={!websocketConnected} className={classNames(upButtonClasses)} onClick={onUpClick}>
            <div className='arrow'><span /></div>
          </button>
          <button disabled={!websocketConnected} className={classNames(stopButtonClasses)} onClick={onStopClick}>
            <div className='pause'><div /><div /></div>
          </button>
          <button disabled={!websocketConnected} className={classNames(downButtonClasses)} onClick={onDownClick}>
            <div className='arrow'><span /></div>
          </button>
        </div>
      </div>
    );
  };

  const labels = _.uniq([windowConfig.label, shutterConfig.label]).filter(Boolean);

  const renderDetails = () => {
    if(!detailed) {
      return null;
    }

    return (
      <div className='window__details'>
        {renderAdditionalControls()}
        <div className='window__details__item'>
          <div>Control start</div>
          <div style={{
            fontSize: '10px',
            fontStyle: 'italic',
          }}>{humanDate(initSince)}</div>
        </div>
        {windowSince ? 
          <div className='window__details__item'>
            <div>{windowHumanValue}</div>
            <div style={{
              fontSize: '10px',
              fontStyle: 'italic',
            }}>{humanDate(windowSince)}</div>
          </div>
          : null
        }
        {buttonActiveSince ? 
          <div className='window__details__item'>
            <div>Schalter: {buttonHumanValue}</div>
            <div style={{
              fontSize: '10px',
              fontStyle: 'italic',
            }}>{humanDate(buttonActiveSince)}</div>
          </div>
          : null
        }
      </div>
    );
  }

  return (
    <div className='window'>
      <div className='window__label'>{labels.join('/')}</div>
      {renderOpenStatus()}
      {renderShutter()}
      {renderDetails()}
    </div>
  );
};

export default Window;
