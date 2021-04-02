import LogicEngineManager from "../../../logic-engine/logic-engine-manager";

const adapterFactory = (
  adaptater: (
    manager: LogicEngineManager,
    key: string,
    mappedArgs: Record<string | number | symbol, unknown>
  ) => void
) => (
  mapPropsToAdapterArgs: (
    args: Record<string | number | symbol, unknown>
  ) => Record<string | number | symbol, unknown> = (args) => args
) => (
  manager: LogicEngineManager,
  key: string,
  props: Record<string | number | symbol, unknown>
): void => {
  const mappedArgs = mapPropsToAdapterArgs(props);
  adaptater(manager, key, mappedArgs);
};

export default adapterFactory;
