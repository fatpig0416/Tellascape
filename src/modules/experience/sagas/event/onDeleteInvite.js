import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onDeleteInvite(api, payload) {
  try {
    const response = yield call(api.deleteInvite, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }

      yield put(Actions.deleteInviteSuccess(response.data));
      let req = {
        token: payload.data.token,
        parentID: payload.data.parentID,
      };
      yield put(Actions.getGuestLists(req));
    } else {
      if (payload.data.onFail) {
        let problem = response.problem;
        if (problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') {
          payload.data.onFail('Something went wrong. Please try again.');
        } else {
          if (response.data !== null) {
            payload.data.onFail(response.data.msg);
          } else {
            payload.data.onFail('Something went wrong. Please try again.');
          }
        }
      }
      if (response.data !== null) {
        yield put(Actions.deleteInviteFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.deleteInviteFailure(error.message));
  }
}
