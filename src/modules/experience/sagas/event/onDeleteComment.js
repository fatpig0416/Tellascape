import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';

export function* onDeleteComment(api, payload) {
  try {
    const response = yield call(api.deleteComment, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      yield put(Actions.deleteCommentSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.deleteCommentFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.deleteCommentFailure(error.message));
  }
}
