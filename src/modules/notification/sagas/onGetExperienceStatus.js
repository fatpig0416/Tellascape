import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetExperienceStatus(api, payload) {
  try {
    const response = yield call(api.getExperienceStatus, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      yield put(Actions.experienceStatusSuccess(response.data));
    } else {
      if (response.data) {
        if (payload.data.onFail) {
          payload.data.onFail(response.data.msg);
        }
        yield put(Actions.experienceStatusFailure(response.data.msg));
      } else {
        if (payload.data.onFail) {
          payload.data.onFail('Something went wrong. Please try again later.');
        }
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.experienceStatusFailure(error.message));
  }
}
