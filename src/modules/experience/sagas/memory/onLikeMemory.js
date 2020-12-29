import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/memory';

export function* onLikeMemory(api, payload) {
  try {
    const response = yield call(api.likeEvent, payload.data.formData);
    if (response.ok) {
      let req = null;
      const { formData } = payload.data;
      if (formData._parts[4] !== undefined && formData._parts[4][1] !== null) {
        req = {
          token: formData._parts[0][1],
          parentID: formData._parts[1][1],
          uid: formData._parts[4][1],
          onSuccess: res => {
            if (payload.data.onSuccess) {
              payload.data.onSuccess();
            }
          },
        };
      } else {
        req = {
          token: formData._parts[0][1],
          parentID: formData._parts[1][1],
          onSuccess: res => {
            if (payload.data.onSuccess) {
              payload.data.onSuccess();
            }
          },
        };
      }
      // yield put(Actions.getMemory(req));

      //yield put(Actions.likeMemorySuccess(response.data));
    } else {
      yield put(Actions.likeMemoryFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.likeMemoryFailure(error.message));
  }
}
