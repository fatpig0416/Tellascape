import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetSettings(api, payload) {
  try {
    const response = yield call(api.getSettings, payload.data);
    if (response.ok) {
      yield put(Actions.getSettingsSuccess(response.data));
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
    } else {
      if (payload.data.onFail) {
        payload.data.onFail(response.data.msg, response.status);
      }
      yield put(Actions.getSettingsFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.getSettingsFailure(error.message));
  }
}
