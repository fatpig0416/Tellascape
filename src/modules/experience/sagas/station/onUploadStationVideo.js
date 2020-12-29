import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/station';

export function* onUploadStationVideo(api, payload) {
  try {
    const response = yield call(api.video, payload.data);

    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      // yield put(Actions.uploadStationVideoSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail(payload.data.reqMediaId, payload.data.formData);
      }
      yield put(Actions.uploadStationVideoFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(payload.data.reqMediaId, payload.data.formData);
    }
    console.log(`error is: `, error);
    yield put(Actions.uploadStationVideoFailure(error.message));
  }
}
