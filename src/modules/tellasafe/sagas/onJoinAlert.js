import { call, put } from 'redux-saga/effects';

export function* onJoinAlert(api, payload) {
  try {
    const response = yield call(api.joinAlert, payload.data.joinObj);
    if (response.ok) {
      payload.data.onSuccess(response.data.data);
    } else {
      payload.data.onFail(response.data.msg);
    }
  } catch (error) {
    payload.data.onFail(error.message);
  }
}
