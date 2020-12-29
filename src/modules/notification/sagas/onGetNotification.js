import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetNotification(api, payload) {
  try {
    const response = yield call(api.getNotification, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      yield put(Actions.notificationSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.notificationFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.notificationFailure(error.message));
  }
}
