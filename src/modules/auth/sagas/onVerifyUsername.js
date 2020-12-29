import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onVerifyUsername(api, payload) {
  try {
    const response = yield call(api.verifyUsername, payload.data);
    if (response.ok) {
      yield put(Actions.verifyUsernameSuccess(payload.data));
    } else {
      yield put(Actions.verifyUsernameFailure(payload.data));
    }
  } catch (error) {
    yield put(Actions.verifyUsernameFailure(error.message));
  }
}
