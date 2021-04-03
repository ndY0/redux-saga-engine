import logicEngineManager from "..";
import { Class } from "../types";
import LogicEngineManager from "../logic-engine-manager";

const register = (
  key: string,
  isRoot: boolean,
  coreLogic: { [key: string]: (...args: unknown[]) => Generator },
  adaptersDefiniton: { [key: string]: (...args: unknown[]) => Generator },
  [...adapters]: Array<<U extends Class>(previous: Class) => Class & U> = []
): void => {
  logicEngineManager.register(
    key,
    isRoot,
    coreLogic,
    adaptersDefiniton,
    adapters
  );
};

const registerExtensionBefore = (
  fn: (engineManager: LogicEngineManager, ...args: unknown[]) => unknown,
  ...args: unknown[]
): void => {
  logicEngineManager.registerExtensionBefore(fn, logicEngineManager, ...args);
};

const registerExtensionAfter = (
  fn: (engineManager: LogicEngineManager, ...args: unknown[]) => unknown,
  ...args: unknown[]
): void => {
  logicEngineManager.registerExtensionAfter(fn, logicEngineManager, ...args);
};

const bootstrap = (...args: unknown[]): LogicEngineManager => {
  logicEngineManager.bootstrap(...args);
  return logicEngineManager;
};

export { register, registerExtensionBefore, registerExtensionAfter, bootstrap };
