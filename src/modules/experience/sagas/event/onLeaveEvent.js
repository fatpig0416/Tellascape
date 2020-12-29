import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onLeaveEvent(api, payload) {
  try {
    const response = yield call(api.leaveEvent, payload.data.formData);
    if (response.ok) {
      payload.data.leaveEventSuccess();
      yield put(Actions.leaveEventSuccess(response.data));
    } else {
      payload.data.leaveEventFailure();
      yield put(Actions.leaveEventFailure(response.data.msg));
    }
  } catch (error) {
    payload.data.leaveEventFailure();
    yield put(Actions.leaveEventFailure(error.message));
  }
}
