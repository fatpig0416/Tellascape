import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/event/index';

export function* onSetProfileSettings(api, payload) {
  try {
    const response = yield call(api.setProfileSettings, payload.data);
    if (response.ok) {
      yield put(Actions.setProfileSettingsSuccess(response.data));
      const value = payload.data;
      const obj = {
        token: value._parts[0][1],
        uid: value._parts[1][1],
        index: 0,
      };
      yield put(Actions.getProfileData(obj));
    } else {
      yield put(Actions.setProfileSettingsFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.setProfileSettingsFailure(error.message));
  }
}
