import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/station';

export function* onLikeStation(api, payload) {
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
      // yield put(Actions.getStation(req));

      // yield put(Actions.likeStationSuccess(response.data));
    } else {
      yield put(Actions.likeStationFailure(response.data.msg));
    }
  } catch (error) {
    console.log('error is:', error);
    yield put(Actions.likeStationFailure(error.message));
  }
}
