import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetContacts(api, payload) {
  try {
    const response = yield call(api.getContacts, payload.data);
    if (response.ok) {
      yield put(Actions.getContactSuccess(response.data));
    } else {
      yield put(Actions.getContactFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getContactFailure(error.message));
  }
}
