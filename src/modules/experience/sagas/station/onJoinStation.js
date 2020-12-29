import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/station';

export function* onJoinStation(api, payload) {
  try {
    const response = yield call(api.joinStation, payload.data.joinObj);
    if (response.ok) {
      payload.data.onSuccess(response.data.data);
    } else {
      payload.data.onFail(response.data.msg, response.status);
    }
  } catch (error) {
    payload.data.onFail(error.message);
  }
}
