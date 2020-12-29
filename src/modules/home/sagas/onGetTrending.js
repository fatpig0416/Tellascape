import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetTrending(api, payload) {
  try {
    const response = yield call(api.trending, payload.data);
    if (response.ok) {
      if (payload.data && payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      yield put(Actions.getTrendingSuccess(response.data));
    } else {
      if (payload.data && payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.getTrendingFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data && payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.getTrendingFailure(error.message));
  }
}
