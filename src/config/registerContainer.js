import { all } from 'redux-saga/effects';
import authWatcher from '../modules/auth/sagas/index';
import experienceWatcher from '../modules/experience/sagas/event/index';
import stationWatcher from '../modules/experience/sagas/station/index';
import memoryWatcher from '../modules/experience/sagas/memory/index';
import notificationWatcher from '../modules/notification/sagas/index';
import messageWatcher from '../modules/message/sagas/index';
import tellasafeWatcher from '../modules/tellasafe/sagas/index';

import exploreWatcher from '../modules/home/sagas/index';
/*
here we have send all the saga watcher into all()
because we wants these all request go together
in the same time. don't wait for first request to complete and then next start
so by all() all request process.
*/
export default function* rootSaga() {
  yield all([
    authWatcher(),
    exploreWatcher(),
    stationWatcher(),
    experienceWatcher(),
    memoryWatcher(),
    notificationWatcher(),
    messageWatcher(),
    tellasafeWatcher(),
  ]);
}
