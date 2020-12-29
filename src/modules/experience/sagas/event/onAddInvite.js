import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onAddInvite(api, payload) {
  try {
    const response = yield call(api.addInvite, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      yield put(Actions.addInviteSuccess(response.data));
      let req = {
        token: payload.data.token,
        parentID: payload.data.parentID,
      };
      yield put(Actions.getPostEvent(req));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.addInviteFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.addInviteFailure(error.message));
  }
}
