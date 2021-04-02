import React, { ReactChildren } from "react";
import EngineContext from "../engine-context";
import LogicEngineManager from "../../logic-engine/logic-engine-manager";

const EngineProvider = ({
  manager,
  children,
}: {
  manager: LogicEngineManager;
  children: ReactChildren;
}): JSX.Element => {
  return (
    <EngineContext.Provider value={manager}>{children}</EngineContext.Provider>
  );
};

export default EngineProvider;
