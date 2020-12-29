import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onAddEventComment(api, payload) {
  try {
    const response = yield call(api.addEventComment, payload.data);
    if (response.ok) {
      yield put(Actions.addEventCommentSuccess(response.data));
      //  yield put(Actions.getEventComments(payload.data));
      let req = {
        token: payload.data._parts[0][1],
        parentID: payload.data._parts[2][1],
      };
      yield put(Actions.getPostEvent(req));
    } else {
      yield put(Actions.addEventCommentFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.addEventCommentFailure(error.message));
  }
}
