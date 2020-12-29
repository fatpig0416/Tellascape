import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';

export function* onShareUrl(api, payload) {
  try {
    const response = yield call(api.getShareUrl, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      yield put(Actions.shareUrlSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.shareUrlFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.shareUrlFailure(error.message));
  }
}
