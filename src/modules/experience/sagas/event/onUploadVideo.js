import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onUploadVideo(api, payload) {
  try {
    const response = yield call(api.video, payload.data);

    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      // yield put(Actions.uploadVideoSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail(payload.data.reqMediaId, payload.data.formData);
      }
      yield put(Actions.uploadVideoFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(payload.data.reqMediaId, payload.data.formData);
    }
    yield put(Actions.uploadImageFailure(error.message));
  }
}
