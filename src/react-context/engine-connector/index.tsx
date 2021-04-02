import React, { useMemo, useEffect, useRef, useState } from "react";
import isEqual from "lodash.isequal";
import EngineContext from "../engine-context";
import engineConnectorFactory from "../engine-connector-factory/engine-connector-factory";
import { Class } from "../../logic-engine/types";

const useDeepEffect = (fn: () => void, deps: unknown[]) => {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);
  useEffect(() => {
    const isSame = prevDeps.current.every((curr, index) =>
      isEqual(curr, deps[index])
    );
    if (isFirst.current || !isSame) {
      fn();
    }
    isFirst.current = false;
    prevDeps.current = deps;
  }, [deps, fn]);
};

const connectEngine = (
  connectionDefinitionsList: [
    string,
    ((...args: unknown[]) => void)[],
    (...args: unknown[]) => void[]
  ][]
) => (ComponentToProxy: Class<JSX.ElementClass>) => {
  return (props: Record<string | number | symbol, unknown>): JSX.Element => {
    const [memoizedProps, setMemoizedProps] = useState(props);
    useDeepEffect(() => {
      setMemoizedProps(props);
    }, [props, setMemoizedProps]);
    const memoizedComponent = useMemo(
      () => (
        <EngineContext.Consumer>
          {(manager) => {
            const Component = engineConnectorFactory(
              manager,
              ComponentToProxy,
              connectionDefinitionsList.map(([key, adapterList]) => [
                key,
                adapterList,
              ]),
              connectionDefinitionsList.map(([key, , mapSagaToProps]) => [
                key,
                mapSagaToProps,
              ]),
              memoizedProps
            );
            return <Component />;
          }}
        </EngineContext.Consumer>
      ),
      [memoizedProps]
    );
    return memoizedComponent;
  };
};

export default connectEngine;
