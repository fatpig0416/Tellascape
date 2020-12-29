import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetMarkers(api, payload) {
  try {
    const response = yield call(api.markers, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      yield put(Actions.getMarkersSuccess(response.data));
    } else {
      yield put(Actions.getMarkersFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getMarkersFailure(error.message));
  }
}
