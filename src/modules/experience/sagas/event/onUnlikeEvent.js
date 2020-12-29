import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onUnLikeEvent(api, payload) {
  try {
    const response = yield call(api.unlikeEvent, payload.data);
    if (response.ok) {
      yield put(Actions.unlikeEventSuccess(response.data));
    } else {
      yield put(Actions.unlikeEventFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.unlikeEventFailure(error.message));
  }
}
