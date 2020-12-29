import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onGetGuestLists(api, payload) {
  try {
    const response = yield call(api.getGuestLists, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      yield put(Actions.getGuestListsSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.getGuestListsFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.getGuestListsFailure(error.message));
  }
}
