import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onGetOtherUserMedia(api, payload) {
  try {
    const response = yield call(api.getOtherUserMedia, payload.data);
    if (response.ok) {
      yield put(Actions.getOtherUserMediaSuccess(response.data));
    } else {
      yield put(Actions.getOtherUserMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getOtherUserMediaFailure(error.message));
  }
}
