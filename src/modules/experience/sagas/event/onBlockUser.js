import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';

export function* onBlockUser(api, payload) {
  try {
    const response = yield call(api.blockUser, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      let res = {
        is_blocked: payload.data.is_blocked,
        data: response.data.data,
      };
      yield put(Actions.blockUserSuccess(res));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.blockUserFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.blockUserFailure(error.message));
  }
}
