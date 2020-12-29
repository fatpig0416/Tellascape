import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/event/index';

export function* onBlockProfile(api, payload) {
  try {
    const response = yield call(api.blockProfile, payload.data);
    if (response.ok) {
      yield put(Actions.blockProfileSuccess(response.data));
    } else {
      yield put(Actions.blockProfileFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.blockProfileFailure(error.message));
  }
}
