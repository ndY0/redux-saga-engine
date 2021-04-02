import logicEngineManager from "../../logic-engine";

const useSaga = (
  engine: string
): ((funcName: string, ...args: unknown[]) => void) => {
  if (!logicEngineManager.engines.has(engine)) {
    throw new Error(`no engine registered at key ${engine}`);
  }
  return (funcName: string, ...args: unknown[]) =>
    logicEngineManager.exec(engine, funcName, ...args);
};

const useEngineAdapter = (
  props: unknown,
  ...hookAdapters: ((...args: unknown[]) => void)[]
): void => {
  if (
    !Array.isArray(hookAdapters) ||
    !hookAdapters.reduce((acc, hook) => acc && typeof hook === "function", true)
  ) {
    throw new Error("malformed hook adapter definition list");
  }
  hookAdapters.forEach((hook) => hook(props));
};

export { useSaga, useEngineAdapter };
