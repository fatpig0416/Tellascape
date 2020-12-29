import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/memory/index';

export function* onUploadMemoryImage(api, payload) {
  try {
    const response = yield call(api.image, payload.data);

    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      // yield put(Actions.uploadMemoryImageSuccess(response.data));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail(payload.data.reqMediaId, payload.data.formData);
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(payload.data.reqMediaId, payload.data.formData);
    }
  }
}
