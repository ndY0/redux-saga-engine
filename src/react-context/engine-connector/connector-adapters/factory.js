import React from 'react';

const adapterFactory = adaptater => (mapPropsToAdapterArgs = args => args) => (
  manager,
  key,
  props
) => {
    const mappedArgs = mapPropsToAdapterArgs(props);
    adaptater(manager, key, mappedArgs);
};

export default adapterFactory;
