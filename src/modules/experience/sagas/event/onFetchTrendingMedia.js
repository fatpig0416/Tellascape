import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onFetchTrendingMedia(api, payload) {
  try {
    const response = yield call(api.fetch, payload.data);

    if (response.ok) {
      yield put(Actions.fetchTrendingMediaSuccess(response.data));
    } else {
      yield put(Actions.fetchTrendingMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.fetchTrendingMediaFailure(error.message));
  }
}
