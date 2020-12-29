import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onBookmark(api, payload) {
  try {
    const response = yield call(api.bookmark, payload.data);
    if (response.ok) {
      yield put(Actions.bookmarkPostSuccess(response));
    } else {
      yield put(Actions.bookmarkPostFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.bookmarkPostFailure(error.message));
  }
}
