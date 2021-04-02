import React from "react";
import LogicEngineManager from "../../logic-engine/logic-engine-manager";
import { Class } from "../../logic-engine/types";

const wrapperFactory = ({
  Component,
  adapterList,
  props,
  manager,
}: {
  Component: Class<JSX.ElementClass>;
  adapterList: [string, ((...args: unknown[]) => void)[]][];
  props: unknown;
  manager: LogicEngineManager;
}) => (): JSX.Element => {
  if (
    adapterList &&
    Array.isArray(adapterList) &&
    adapterList.reduce(
      (acc, curr) =>
        acc &&
        typeof curr[0] === "string" &&
        Array.isArray(curr[1]) &&
        curr[1].reduce(
          (acc2, curr2) => acc2 && typeof curr2 === "function",
          true
        ),
      true
    )
  ) {
    adapterList.forEach(([key, adapterList]) => {
      adapterList.forEach((adapter) => adapter(manager, key, props));
    });
  }
  return (
    <>
      <Component {...props} />
    </>
  );
};

const engineConnectorFactory = (
  manager: LogicEngineManager,
  Component: Class<JSX.ElementClass>,
  adapterList: [string, ((...args: unknown[]) => void)[]][],
  mapsSagaToProps: [string, (...args: unknown[]) => void][],
  props: Record<string | number | symbol, unknown>
): (() => JSX.Element) => {
  let extendedProps = { ...props };
  if (
    mapsSagaToProps &&
    Array.isArray(mapsSagaToProps) &&
    mapsSagaToProps.reduce(
      (acc, curr) =>
        acc &&
        Array.isArray(curr) &&
        typeof curr[0] === "string" &&
        typeof curr[1] === "function",
      true
    )
  ) {
    const sagaToPropsMapping = mapsSagaToProps.reduce(
      (acc, [key, mapSagaToProps]) => ({
        ...acc,
        ...(mapSagaToProps
          ? mapSagaToProps(
              (fnName, ...args) => manager.exec(key, fnName, ...args),
              {}
            )
          : () => ({})),
      }),
      {}
    );
    extendedProps = { ...extendedProps, ...sagaToPropsMapping };
  }
  return wrapperFactory({
    Component,
    adapterList,
    props: extendedProps,
    manager,
  });
};

export default engineConnectorFactory;
