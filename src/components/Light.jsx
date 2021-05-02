import _ from 'lodash';
import classNames from 'classnames';
import React, {
  useState,
} from 'react';

const Light = function(props) {
  const {config = {}, status = {}} = props;

  return (
    <div className='light'>
      <div className='light__label'>{config.label}</div>
      <div className='light__value'>{status.value ? 'an' : 'aus'}</div>
    </div>
  )
};

export default Light;
