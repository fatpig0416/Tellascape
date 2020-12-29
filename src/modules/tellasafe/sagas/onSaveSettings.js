import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onSaveSettings(api, payload) {
  try {
    const response = yield call(api.saveSettings, payload.data.formData);
    if (response.ok) {
      const tellasafeObj = {
        response,
        payload: payload.data,
      };
      yield put(Actions.saveSettingsSuccess(tellasafeObj));
    } else {
      yield put(Actions.saveSettingsFailure(payload.data));
    }
  } catch (error) {
    yield put(Actions.saveSettingsFailure(payload.data));
  }
}
