import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onGetEvent(api, payload) {
  try {
    const response = yield call(api.getEvent, payload.data);
    if (response.ok) {
      yield put(Actions.getEventSuccess(response.data));
    } else {
      yield put(Actions.getEventFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getEventFailure(error.message));
  }
}
