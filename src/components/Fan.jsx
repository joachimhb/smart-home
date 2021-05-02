import _ from 'lodash';
import classNames from 'classnames';
import React, {
  useState,
} from 'react';

const Fan = function(props) {
  const {config = {}, status = {}} = props;

  const onAutoClick = () => {};
  const onOffClick = () => {};
  const onMaxClick = () => {};
  const onMinClick = () => {};

  const {value, control} = status;

  return (
    <div className='fan'>
      <div className='fan__label'>
        {config.label}
      </div>
      <div className='fan__status'>
        <div className={`fan__status__control fan__status__control--${control}`}>
          {control}
        </div>
        <div>:</div>
        <div className={`fan__status__value  fan__status__value--${value}`}>
         {value}
        </div>
      </div>
      <div className='fan__controls'>
        <button className={control === 'auto' ? 'active' : ''} onClick={onAutoClick}>auto</button>
        <button onClick={onOffClick}>off</button>
        <button onClick={onMinClick}>min</button>
        <button onClick={onMaxClick}>max</button>
      </div>
    </div>
  )
};

export default Fan;
