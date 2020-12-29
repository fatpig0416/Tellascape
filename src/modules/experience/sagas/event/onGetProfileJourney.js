import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';

export function* onGetProfileJourney(api, payload) {
  try {
    const response = yield call(api.profileJourney, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      yield put(Actions.profileJourneySuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      if (response.data !== null) {
        yield put(Actions.profileJourneyFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.profileJourneyFailure(error.message));
  }
}
