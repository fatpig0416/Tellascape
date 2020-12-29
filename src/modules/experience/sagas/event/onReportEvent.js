import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onReportEvent(api, payload) {
  try {
    const response = yield call(api.reportEvent, payload.data);
    if (response.ok) {
      yield put(Actions.reportEventSuccess(response.data));
    } else {
      yield put(Actions.reportEventFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.reportEventFailure(error.message));
  }
}
