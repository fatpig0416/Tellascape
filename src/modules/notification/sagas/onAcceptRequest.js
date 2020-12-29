import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onAcceptRequest(api, payload) {
  try {
    const response = yield call(api.acceptRequest, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      let req = {
        token: payload.data.token,
      };
      yield put(Actions.notification(req));
      yield put(Actions.acceptRequestSuccess(response.data));
    } else {
      if (response.data) {
        if (payload.data.onFail) {
          payload.data.onFail(response.data.msg);
        }
        yield put(Actions.acceptRequestFailure(response.data.msg));
      } else {
        if (payload.data.onFail) {
          payload.data.onFail('Something went wrong. Please try again later.');
        }
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.acceptRequestFailure(error.message));
  }
}
