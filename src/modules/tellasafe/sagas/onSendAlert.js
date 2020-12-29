import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onSendAlert(api, payload) {
  try {
    const response = yield call(api.sendAlert, payload.data);
    if (response.ok) {
      yield put(Actions.sendAlertSuccess(response.data));
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
    } else {
      if (payload.data.onFail) {
        payload.data.onFail(response.data.msg, response.status);
      }
      yield put(Actions.sendAlertFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.sendAlertFailure(error.message));
  }
}
