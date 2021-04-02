import { useEffect, useCallback } from 'react';
import adapterFactory from './factory';

const startStop = (manager, managerKey, {...props}) => {
  const { startArgs, stopArgs } = { startArgs: [], stopArgs: [], ...props };
  useEffect(
    useCallback(() => {
      manager.exec(managerKey, 'start', ...startArgs);
      return () => {
        manager.exec(managerKey, 'stop', ...stopArgs);
      };
    }, [manager, managerKey, startArgs, stopArgs]),
    []
  );
}

export default adapterFactory(startStop);
