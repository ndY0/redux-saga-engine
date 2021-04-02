import { call } from "redux-saga/effects";
import LogicEngine from "./logic-engine";
import { composeMixin } from "./helpers/helper";
import { Class } from "./types";
import { SagaMiddleware, MulticastChannel, Saga } from "redux-saga";

export default class LogicEngineManager {
  engines = new Map<string, LogicEngine>([]);

  sagaMiddleware: SagaMiddleware;
  runInitExtension = new Set<{
    type: "before" | "after";
    fn: (...args: unknown[]) => unknown;
    args: unknown[];
  }>();

  registerExtensionBefore(
    fn: (...args: unknown[]) => unknown,
    ...args: unknown[]
  ): void {
    this.runInitExtension.add({
      type: "before",
      fn,
      args,
    });
  }

  registerExtensionAfter(
    fn: (...args: unknown[]) => unknown,
    ...args: unknown[]
  ): void {
    this.runInitExtension.add({
      type: "after",
      fn,
      args,
    });
  }

  register(
    key: string,
    isRoot: boolean,
    coreLogic: { [key: string]: (...args: unknown[]) => Generator },
    adaptersDefiniton: { [key: string]: (...args: unknown[]) => Generator },
    [...adapters]: Array<<U extends Class>(previous: Class) => Class & U> = []
  ): void {
    if (typeof key !== "string") {
      throw new Error("string registering key expected");
    }
    if (this.engines.has(key)) {
      throw new Error("duplicate key register");
    }
    this.engines.set(
      key,
      new (composeMixin(...adapters)(LogicEngine))({
        isRoot,
        coreLogic,
        adapters: adaptersDefiniton,
      })
    );
  }

  initSagas(sagaMiddleware: SagaMiddleware): void {
    this.sagaMiddleware = sagaMiddleware;
    this.runInitExtension.forEach((extensionInit) => {
      if (extensionInit.type === "before") {
        extensionInit.fn(...extensionInit.args);
      }
    });
    this.engines.forEach((engine) => sagaMiddleware.run(engine.init));
    this.runInitExtension.forEach((extensionInit) => {
      if (extensionInit.type === "after") {
        extensionInit.fn(...extensionInit.args);
      }
    });
  }

  bootstrap(...args: unknown[]): void {
    const { engines } = this;
    this.run(function* run() {
      for (const engine of engines.values()) {
        yield call(engine.bootstrap, ...args);
      }
    }, ...args);
  }

  run(fn: Saga<unknown[]>, ...args: unknown[]): void {
    this.sagaMiddleware.run(fn, ...args);
  }

  exec(key: string, funcName: string, ...args: unknown[]): void {
    const engine = this.engines.get(key);
    if (!engine) {
      throw new Error("undefined registry key");
    }
    if (!engine[funcName] || typeof engine[funcName] !== "function") {
      throw new Error(`engin ${key} has no ${funcName} handler`);
    }
    this.run(engine[funcName], ...args);
  }

  getEngineChannel(engineName: string): MulticastChannel<unknown> {
    if (!this.engines.has(engineName)) {
      throw new Error(`no ${engineName} engine registered`);
    }
    return this.engines.get(engineName).channel;
  }
}
