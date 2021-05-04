// import _ from 'lodash';
// import classNames from 'classnames';
import React from 'react';
import humanDate from '../lib/humanDate';

const Light = function(props) {
  const {config = {}, status = {}, detailed} = props;

  return (
    <div className='light'>
      <div className='light__label'>{config.label}</div>
      <div className='light__value' title={`Seit: ${status.since || 'unbekannt'}`}>{status.value === 'on' ? 'an' : 'aus'}</div>
      {detailed ? <div className='light__since'>seit {humanDate(status.since) || 'unbekannt'}</div> : null}
      {detailed ? <div className='light__switch' onClick={() => props.onChange(status.value === 'on' ? 'off' : 'on')}>SWITCH</div> : null}
    </div>
  );
};

export default Light;
