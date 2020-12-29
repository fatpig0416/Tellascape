import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/station/index';

export function* onLeaveStation(api, payload) {
  try {
    const response = yield call(api.leaveStation, payload.data.formData);
    if (response.ok) {
      payload.data.leaveStationSuccess();
    } else {
      payload.data.leaveStationFailure();
    }
  } catch (error) {
    console.log(`error in leave Station Request: `, error);
  }
}
