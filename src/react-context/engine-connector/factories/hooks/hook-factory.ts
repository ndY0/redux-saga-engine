import logicEngineManager from "../../../../logic-engine";
import LogicEngineManager from "../../../../logic-engine/logic-engine-manager";

const hookFactory = (
  adaptater: (
    manager: LogicEngineManager,
    key: string,
    props: Record<string | number | symbol, unknown>
  ) => void
) => (
  engine: string,
  mapPropsToAdapterArgs: (
    args: Record<string | number | symbol, unknown>
  ) => Record<string | number | symbol, unknown> = (args) => args
) => (props: Record<string | number | symbol, unknown>): void => {
  const mappedArgs = mapPropsToAdapterArgs({ ...props });
  adaptater(logicEngineManager, engine, mappedArgs);
};

export default hookFactory;
