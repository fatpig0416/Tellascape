import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onGetEventComments(api, payload) {
  try {
    const response = yield call(api.getEventComments, payload.data);
    if (response.ok) {
      yield put(Actions.getEventCommentsSuccess(response.data));
    } else {
      yield put(Actions.getEventCommentsFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getEventCommentsFailure(error.message));
  }
}
