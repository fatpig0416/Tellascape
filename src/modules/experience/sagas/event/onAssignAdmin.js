import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';

export function* onAssignAdmin(api, payload) {
  try {
    const response = yield call(api.assignGuestAdmin, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      let req = {
        token: payload.data.token,
        parentID: payload.data.parentID,
      };
      if (payload.data.type && payload.data.type === 'guest') {
        yield put(Actions.getGuestLists(req));
      }
      yield put(Actions.assignAdminSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.assignAdminFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.assignAdminFailure(error.message));
  }
}
