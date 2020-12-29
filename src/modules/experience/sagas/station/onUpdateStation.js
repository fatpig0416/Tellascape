import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/station/index';

export function* onUpdateStation(api, payload) {
  try {
    const response = yield call(api.updateStation, payload.data.formData);

    if (response.ok) {
      yield put(Actions.updateStationSuccess(response.data));
      if (payload.data.updateStationSuccess) {
        payload.data.updateStationSuccess(response.data);
      }
    } else {
      yield put(Actions.updateStationFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.updateStationFailure(error.message));
  }
}
