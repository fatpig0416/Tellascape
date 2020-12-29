import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onUpdateEvent(api, payload) {
  try {
    const response = yield call(api.updateEvent, payload.data.formData);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      yield put(Actions.updateEventSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.updateEventFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.updateEventFailure(error.message));
  }
}
