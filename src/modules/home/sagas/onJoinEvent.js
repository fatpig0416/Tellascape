import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onJoinEvent(api, payload) {
  try {
    const response = yield call(api.joinEvent, payload.data.joinObj);
    if (response.ok) {
      payload.data.joinEventSuccess(response.data.data);
      yield put(Actions.joinEventSuccess(response.data));
    } else {
      payload.data.joinEventFailure(response.data.msg);
      yield put(Actions.joinEventFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.joinEventFailure(error.message));
  }
}
