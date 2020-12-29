import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetPeoples(api, payload) {
  try {
    const response = yield call(api.peoples, payload.data);

    if (response.ok) {
      yield put(Actions.getPeoplesSuccess(response.data));
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
    } else {
      yield put(Actions.getPeoplesFailure(response.data.msg));
      if (payload.data.onFail) {
        payload.data.onFail();
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.getPeoplesFailure(error.message));
  }
}
