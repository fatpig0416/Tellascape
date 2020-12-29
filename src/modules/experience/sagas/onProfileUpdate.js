import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/event/index';
import AuthAction from '../../auth/reducers/index';

export function* onProfileUpdate(api, payload) {
  try {
    const response = yield call(api.profileUpdate, payload.data.formData);
    if (response.ok) {
      yield put(Actions.profileUpdateSuccess(response.data));
      const value = payload.data.formData;
      const obj = {
        token: value._parts[5][1],
        uid: value._parts[6][1],
        index: 0,
      };
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      yield put(Actions.getProfileData(obj));
      let user = {
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        profile_img: response.data.profile_img,
        gender: response.data.gender,
        user_name: response.data.user_name,
        email: response.data.email,
        uid: response.data.uid,
        phone: response.data.phone,
        access_token: value._parts[5][1],
      };
      yield put(AuthAction.verifyTokenSuccess(user));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.profileUpdateFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.profileUpdateFailure(error.message));
  }
}
