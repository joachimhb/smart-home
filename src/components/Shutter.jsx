import classNames from 'classnames';
import _ from 'lodash';

import React, {
  useContext,
} from 'react';
import WebsocketConnectionContext from '../contexts/WebsocketConnection';
import humanDate from '../lib/humanDate';

const Shutter = function(props) {
  const {
    config  = {},
    data = {},
    detailed
  } = props;

  const {since: initSince}                                   = data.init || {};
  const {value: statusValue,       since: statusSince}       = data.status || {};
  const {value: movementValue,     since: movementSince}     = data.movement || {};
  // const {value: buttonActiveValue, since: buttonActiveSince} = buttonStatus.active || {};

  const websocketConnected = useContext(WebsocketConnectionContext);

  const onUpClick     = () => props.onMovementChange('up');
  const onStopClick   = () => props.onMovementChange('stop');
  const onDownClick   = () => props.onMovementChange('down');
  // const onSwitchClick = () => props.onButtonActiveChange(!buttonActiveValue);
  // const onMoveToClick = value => props.onMoveToSet(value);

  // let buttonHumanValue = null;

  // if(!_.isNil(buttonActiveValue)) {
  //   buttonHumanValue = buttonActiveValue === false ? 'inaktiv' : 'aktiv';
  // }

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

  // const activeButtonClasses = [
  //   ...buttonClasses,
  //   'window__shutter__controls__button--active',
  //   buttonActiveValue === false ? 'inactive' : 'active',
  // ];

  // const renderAdditionalControls = () => {
  //   const additionalControls = [
  //     <button key='40' disabled={!websocketConnected} className={classNames(buttonClasses)} onClick={() => onMoveToClick(40)}>
  //         40
  //     </button>,
  //     <button key='80' disabled={!websocketConnected} className={classNames(buttonClasses)} onClick={() => onMoveToClick(80)}>
  //         80
  //     </button>,
  //   ];  
  
  //   if(buttonConfig.id) {
  //     additionalControls.unshift(
  //       <button key='button-active' disabled={!websocketConnected} className={classNames(activeButtonClasses)} onClick={onSwitchClick}>
  //         L
  //       </button>
  //     )
  //   }
  
  //   return (
  //     <div className='window__shutter__controls'>
  //       {additionalControls}
  //     </div>
  //   );
  // }

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

export default Shutter;
