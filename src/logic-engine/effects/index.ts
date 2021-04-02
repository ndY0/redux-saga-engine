import {
  put,
  take,
  ChannelPutEffect,
  Pattern,
  ChannelTakeEffect,
  ForkEffect,
  CallEffect,
} from "redux-saga/effects";
import LogicEngineManager from "..";
import { fork, cancel, call } from "redux-saga/effects";

function* putEngineChannel<T>(
  engineName: string,
  action: T
): Generator<ChannelPutEffect<T>, void, unknown> {
  yield put<T>(LogicEngineManager.getEngineChannel(engineName), action);
}
function* takeEngineChannel(
  engineName: string,
  selector: Pattern<unknown>
): Generator<ChannelTakeEffect<unknown>, unknown, unknown> {
  const result = yield take<unknown>(
    LogicEngineManager.getEngineChannel(engineName),
    selector
  );
  return result;
}

const takeEveryEngineChannel = (
  engineName: string,
  selector: Pattern<unknown>,
  sagaHandler: (...args: unknown[]) => Generator,
  ...args: unknown[]
): ForkEffect =>
  fork(function* every() {
    const context = LogicEngineManager.engines.get(engineName).coreLogic;
    while (true) {
      const value = yield takeEngineChannel(engineName, selector);
      yield fork(function* (...argz) {
        yield call([context, sagaHandler], ...argz);
      }, ...args.concat(value));
    }
  });

const takeLatestEngineChannel = (
  engineName: string,
  selector: Pattern<unknown>,
  sagaHandler: (...args: unknown[]) => Generator,
  ...args: unknown[]
): ForkEffect =>
  fork(function* latest() {
    let latestTask;
    const context = LogicEngineManager.engines.get(engineName).coreLogic;
    while (true) {
      const value = yield takeEngineChannel(engineName, selector);
      if (latestTask) {
        yield cancel(latestTask);
      }
      latestTask = yield fork(function* (...argz) {
        yield call([context, sagaHandler], ...argz);
      }, ...args.concat(value));
    }
  });

const callEngineSaga = (
  engineName: string,
  sagaHandler: (...args: unknown[]) => Generator,
  ...args: unknown[]
): CallEffect =>
  call(function* callWrapper() {
    const context = LogicEngineManager.engines.get(engineName).coreLogic;
    const result = yield call([context, sagaHandler], ...args);
    return result;
  });

export {
  putEngineChannel,
  takeEngineChannel,
  callEngineSaga,
  takeEveryEngineChannel,
  takeLatestEngineChannel,
};
