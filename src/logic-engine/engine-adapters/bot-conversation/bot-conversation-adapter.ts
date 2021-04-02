import { Class } from "../../types";
import LogicEngine from "../../logic-engine";

const ProcessMotifAdaptater = <T extends Class<LogicEngine>>(
  superclass: T
): T =>
  class ProcessMotifAdaptater extends superclass {
    constructor(args: {
      coreLogic: {
        [key: string]: (
          ...args: unknown[]
        ) => import("../../types").Generator<unknown, unknown, unknown>;
      };
      isRoot?: boolean;
      adapters: {
        [key: string]: (
          ...args: unknown[]
        ) => import("../../types").Generator<unknown, unknown, unknown>;
      };
    }) {
      super(args);
      this.registerHandlers(["resetBotError", "resetBotMessageError"], args);
    }
  };

export default ProcessMotifAdaptater;
