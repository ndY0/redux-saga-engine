# redux-saga-react-engine

a redux-saga engine oriented framework

**_What is redux-saga-react-engine ?_**

redux-saga-react-engine is a framework that let you integrate the [redux-saga](https://redux-saga.js.org) redux side-effect manager into your react Components like a breaze

**_Why redux-saga-react-engine ?_**

this library intent to address a modular approach to the redux-saga side effect management, and get ride of some caveats:

- avoid using redux actions to trigger side effect
- keep saga logic organised and isolated
- simplify redux-saga initialisation

# Contents

1. [Providing saga into views](#providing-saga-into-views)
2. [Define and expose the logic](#define-and-expose-the-logic)
3. [Take advantage of react Hooks](#take-advantage-of-react-Hooks)
4. [Wiring it all up](#wiring-it-all-up)
5. [Extend the experience](#extend-the-experience)

## providing saga into views

redux-saga-react-engine embrasse the redux approach of injecting functionnalities into React components. a connector and a hook-oriented approaches are provided:

connector way :

```jsx
// component/GreetUser.ts
import connectEngine from "redux-saga-react-engine";

function GreetUser({ fetchUserData, userData, userId }) {
  useEffect(() => {
    fetchUserData(userId);
  }, []);

  return <div>Hello, {userData.name} !</div>;
}

const mapUserSagaTopProps = (exec) => ({
  fetchUserData: (userId) => {
    exec("fetchUserData", userId);
  },
});

export default connectEngine([
  [
    "userSaga",
    [startAdapter((props) => ({ startArg: props.userId }))],
    mapUserSagaTopProps,
  ],
])(GreetUser);
```

where userData is retrieved from the redux store

hook way :

```jsx
// component/GreetUser.ts
import { useSaga, useEngineAdapter } from "redux-saga-react-engine/hooks";

function GreetUser(props) {

    const  = { userData, userId } = props;

  const engine = useSaga('userSaga');
  const fetchUserData = userId => {
      engine('fetchUserData', userId);
  };

  useEngineAdapter(props, [useStartAdapter(props => ({startArg: props.userId}))])

  useEffect(() => {
    fetchUserData(userId);
  }, []);

  return <div>Hello, {userData.name} !</div>;
}

export default GreetUser;
```

bot methods give access to an engine, and it's exposed functionnalities, accessibles with their function names.

## define and expose the logic

In order to access a saga engine, you have to register it with the helper function provided by the framework :

```js
// saga/user-saga.ts
import { register } from "redux-saga-react-engine/helpers";
import {
  putEngineChannel,
  takeEveryEngineChannel,
  takeEngineChannel,
} from "redux-saga-react-engine/effects";
import { call, put } from "redux-saga/effects";
import StartAdapter from "./adapters";

register(
  "userSaga", // engineName
  true, // is a root engine (if true, should provide a bootstrapGenerator saga function in coreLogic definition)
  {
    *fetchUserDataSaga({ userId }) {
      const userData = yield call(/*network call*/);
      yield call(this.storeUserDataSaga, userData);
    },
    *storeUserDataSaga(userData) {
      yield put(/* event to store data in redux store */);
    },
    *watch() {
      // logic watcher
      yield takeEngineChannel("APP_STARTED");
      yield takeEngineChannel("INIT");
      yield takeEveryEngineChannel("FETCH_USER_DATA", this.fetchUserDataSaga);
      yield takeEveryEngineChannel("FETCH_USER_DATA", this.fetchUserDataSaga);
    },
  },
  {
    *bootstrapGenerator() {
      yield putEngineChannel("userSaga", { type: "APP_STARTED" });
    },
    *watcherGenerator() {
      // mandatory, the engine initialisation
      yield putEngineChannel("userSaga", { type: "INIT" });
    },
    *start(startArgs) {
      yield putEngineChannel("userSaga", {
        type: "POST_USER_ACCESS",
        userId: startArgs,
      });
    },
    *fetchUserData(userId) {
      yield putEngineChannel("userSaga", { type: "FETCH_USER_DATA", userId });
    },
  },
  [StartAdapter]
);
```

with this simple example, few remarks arise :

- engines logic is encapsulated : the engine logic is defined in an object, an cannot access other engines internal logic. this promotes SOC and helps organise application domaines logic.
- each engine define a public api, wich expose the public actions Components are allowed to access and execute. this helps keeping the code clearer
- each engines is defined a unique channel, wich serve as a bus for dispatching action internally and from other engines. this way, one knows where an information is dispatched.

## take advantage of react Hooks

redux-saga-react-engine provide a simple way to generalise engine functionnality across mutliple components with adapters :
in the previous exemples, we used a few extra functionnalities of the framework :

- a connector adapter

```js
// ./engines/userSaga.js
connectEngine([
  [
    "userSaga",
    [startAdapter((props) => ({ startArg: props.arg }))],
    mapUserSagaTopProps,
  ],
])(GreetUser);
```

- a hook adapter :

```js
useEngineAdapter(props, [
  useStartAdapter((props) => ({ startArg: props.userId })),
]);
```

- an adapter Validator:

```js
import StartAdapter from "./adapters";

register(
  /* ... */
  [StartAdapter]
);
```

the validator take the above form, and ensure the engine ability to match the adapter requirement :

```js
// ./adapter/index.js
const StartStopAdapter = (superclass) =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(["start"], args);
    }
  };

export default StartStopAdapter;
```

the engine manager registerHandlers check the functionnality definition at registration

the adapters is a custom hook, wich is given the engine manager and an engine name :

```js
// ./adapter/index.js
import { useEffect, useCallback } from "react";

const startAdapter = (manager, managerKey, { ...props }) => {
  const { startArgs } = { startArgs: [], ...props };
  useEffect(
    useCallback(() => {
      manager.exec(managerKey, "start", ...startArgs);
    }, [manager, managerKey, startArgs]),
    []
  );
};
```

to use it as a connector Adapter, simply pass it to the adapter factory function :

```js
// ./adapter/index.js
import { adapterFactory } from "redux-saga-react-engine/adapters";
/* ... */
export default adapterFactory(startAdapter);
```

and as a hook, through the hook Factory :

```js
// ./adapter/index.js
import { hookFactory } from "redux-saga-react-engine/adapters";
/* ... */
export default hookFactory(startAdapter);
```

the factory allow you to pass a function tha maps the component props to the arguments required for the adapter.

With this in place, your able to generalise behaviour through your application, without the overhead of managing the definition in every components
In the previous exemple, we defined a behaviour wich would be triggered on the first rendering of the component, but you can leverage any behaviour allowed by React hook API.

## wiring it all up

so far, we defined our logic, integrated it in Components, and defined a bit of reusable behaviour, but all doest it come all together ? redux-saga-react-engine bring to you a simple and solution to initialise your application :

```js
// ./index.js
// initialise logic registration
import "./engines";
import createSagaMiddleware from "redux-saga";
import LogicEngineManager from "redux-saga-react-engine/lib/logic-engine";

const sagaMiddleware = createSagaMiddleware();
/* other middleware configuration */
logicEngineManager.initSagas(sagaMiddleware);
LogicEngineManager.bootstrap(args);
```

first, you import your engine definitions, then initialize them by calling `initSaga(sagaMiddleware)`
and finally call bootstrap with any startup arguments required
the `bootstrap` function will recursively call every `bootstrapGenerator` of your engines is they are tagged as `isRoot=true`

## extend the experience

redux-saga-react-engine allow you to extends the engine with extensions, that you can register using :

```ts
registerExtensionBefore(
   fn: (engineManager: LogicEngineManager, ...args: unknown[]) => unknown,
   engineManager: LogicEngineManager,
   ...args: unknown[]
 )
```

and

```ts
registerExtensionAfter(
   fn: (engineManager: LogicEngineManager, ...args: unknown[]) => unknown,
   engineManager: LogicEngineManager,
   ...args: unknown[]
 )
```

simply pass a function bootstraping your extension, and it will be loaded up, before engine initialisation for the first one, after for the second one

**note**: in order to be taken into account, the file registering your extensions should be loaded before the bootstrap call

### Available extensions :

- [redux-saga-engine-network](https://www.npmjs.com/package/redux-saga-engine-network): a simple network extension, allowing you to register api and socket endpoints and handling them with saga effects
