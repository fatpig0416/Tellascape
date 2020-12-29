import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetAmazings(api, payload) {
  try {
    const response = yield call(api.amazings, payload.data);
    if (response.ok) {
      yield put(Actions.getAmazingsSuccess(response.data));
    } else {
      yield put(Actions.getAmazingsFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getAmazingsFailure(error.message));
  }
}
