import PropTypes from 'prop-types';
import React, { useEffect, useCallback, useState } from 'react';
import adapterFactory from './factory';

const startOnce = (manager, managerKey, {...props}) => {
  const { startArgs } = { startArgs: [], ...props };
  const [started, setHasStarted] = useState(false);
  useEffect(
    useCallback(() => {
      if (!started) {
        manager.exec(managerKey, 'start', ...startArgs);
        setHasStarted(true);
      }
    }, [manager, managerKey, startArgs, started, setHasStarted]),
    []
  );
};


export default adapterFactory(startOnce);
