import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onUpdateQuickEvent(api, payload) {
  try {
    const response = yield call(api.updateQuickEvent, payload.data.formData);
    if (response.ok) {
      if (payload.data.updateEventSuccess) {
        payload.data.updateEventSuccess();
      }
      yield put(Actions.updateQuickEventSuccess(response.data));
    } else {
      if (payload.data.updateEventFailure) {
        payload.data.updateEventFailure();
      }
      yield put(Actions.updateQuickEventFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.updateEventFailure) {
      payload.data.updateEventFailure();
    }
    yield put(Actions.updateQuickEventFailure(error.message));
  }
}
