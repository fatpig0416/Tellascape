import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from '../config/registerModules';
import rootSaga from '../config/registerContainer';

/* ------------- Redux Persist Configuration ------------- */
const persistConfig = {
  key: 'root',
  debug: true,
  timeout: 0,
  version: 0, //New version 0, default or previous version -1
  // transforms: [immutableTransform({records: [AppRecords]})],
  storage: AsyncStorage,
};

/* ------------- Saga Middleware ------------- */
const sagaMiddleware = createSagaMiddleware();
const enhancers = compose(
  applyMiddleware(sagaMiddleware),
  //  autoRehydrate(),
  __DEV__ && global.reduxNativeDevToolsCompose // eslint-disable-line no-undef
    ? global.reduxNativeDevToolsCompose(/* options */)
    : nope => nope
);

if (__DEV__ && global.reduxNativeDevTools) {
  // eslint-disable-line no-undef
  global.reduxNativeDevToolsCompose(store);
}

/* ------------- Assemble Middleware ------------- */
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, {}, enhancers);
sagaMiddleware.run(rootSaga);
export default store;
