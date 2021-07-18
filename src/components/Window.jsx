import classNames from 'classnames';
import _ from 'lodash';

import React, {
  useContext,
} from 'react';
import WebsocketConnectionContext from '../contexts/WebsocketConnection';
import humanDate from '../lib/humanDate';

const shutter = function(props) {
  const {windowConfig = {}, shutterConfig = {}, windowStatus = {}, shutterStatus = {}, detailed} = props;

  const {value: windowValue, since: windowSince}     = windowStatus.status || {};
  const {since: initSince}                           = shutterStatus.init || {};
  const {value: statusValue, since: statusSince}     = shutterStatus.status || {};
  const {value: movementValue, since: movementSince} = shutterStatus.movement || {};

  const websocketConnected = useContext(WebsocketConnectionContext);

  const onUpClick   = () => props.onMovementChange('up');
  const onStopClick = () => props.onMovementChange('stop');
  const onDownClick = () => props.onMovementChange('down');

  const renderOpenStatus = () => {
    if(!windowConfig.id) {
      return null;
    }

    if(_.isNil(windowValue)) {
      return null;
    }

    return (
      <div className='window__open-status' title={`Seit: ${windowSince}`}>{windowValue ? 'offen' : 'geschlossen'}</div>
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

    return [
      <div key='label'>Control start</div>,
      <div key='value' style={{
        fontSize: '10px',
        fontStyle: 'italic',
      }}>{humanDate(initSince)}</div>,
    ];
  }

  return (
    <div className='window'>
      <div className='window__label'>{labels.join('/')}</div>
      {renderDetails()}
      {renderOpenStatus()}
      {renderShutter()}
    </div>
  );
};

export default shutter;
