import { multicastChannel, MulticastChannel } from "redux-saga";
import { call } from "redux-saga/effects";
import { isGenerator } from "./helpers/helper";
import { Generator } from "./types";

export default class LogicEngine {
  channel: MulticastChannel<unknown> = multicastChannel();
  coreLogic: { [key: string]: (...args: unknown[]) => Generator } = {};
  bootstrap: (...args: unknown[]) => Generator;
  init: (...args: unknown[]) => Generator;

  constructor(args: {
    coreLogic: { [key: string]: (...args: unknown[]) => Generator };
    isRoot?: boolean;
    adapters: { [key: string]: (...args: unknown[]) => Generator };
  }) {
    const {
      coreLogic,
      isRoot,
      adapters: { watcherGenerator, bootstrapGenerator, ...restAdapaters },
    } = {
      isRoot: false,
      ...args,
    };
    const localRef = this.coreLogic;
    Object.keys(coreLogic).forEach((logicGeneratorName: string) => {
      if (!isGenerator(coreLogic[logicGeneratorName])) {
        throw new Error(`${logicGeneratorName} should be a generator function`);
      }
      this.coreLogic[logicGeneratorName] = function* (...argz: unknown[]) {
        const res = yield call(
          [localRef, coreLogic[logicGeneratorName]],
          ...argz
        );
        return res;
      };
    });
    if (!isGenerator(watcherGenerator)) {
      throw new Error("watcherGenerator should be a generator function");
    }
    this.init = function* (...argz: unknown[]) {
      const res = yield call(
        [args.adapters, watcherGenerator],
        localRef,
        ...argz
      );
      return res;
    };
    if (isRoot && isGenerator(bootstrapGenerator)) {
      this.bootstrap = function* (...argz: unknown[]) {
        const res = yield call(
          [args.adapters, bootstrapGenerator],
          localRef,
          ...argz
        );
        return res;
      };
    } else {
      this.bootstrap = function* bootstrapGen() {
        yield null;
      };
    }
    Object.keys(restAdapaters).forEach((adaptersGeneratorName) => {
      this[adaptersGeneratorName] = function* (...argz: unknown[]) {
        const res = yield call(
          [args.adapters, restAdapaters[adaptersGeneratorName]],
          localRef,
          ...argz
        );
        return res;
      };
    });
  }

  registerHandlers(
    handlerNameList: string[],
    constructorArgs: {
      coreLogic: { [key: string]: (...args: unknown[]) => Generator };
      isRoot?: boolean;
      adapters: { [key: string]: (...args: unknown[]) => Generator };
    }
  ): void {
    handlerNameList.forEach((handlerName: string) => {
      if (
        !constructorArgs.adapters[handlerName] ||
        !isGenerator(constructorArgs.adapters[handlerName])
      ) {
        throw new Error(
          `${handlerName} adapter should be provided for this engine`
        );
      }
    });
  }
}
