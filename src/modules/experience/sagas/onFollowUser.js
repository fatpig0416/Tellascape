import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/event/index';
import ExploreAction from '../../home/reducers/index';

export function* onFollowUser(api, payload) {
  try {
    const response = yield call(api.followUser, payload.data.formData);
    if (response.ok) {
      yield put(Actions.followUserSuccess(response.data));
      const value = payload.data.formData;
      const profileObj = {
        token: value._parts[0][1],
        uid: value._parts[2][1],
        index: 0,
      };
      yield put(Actions.getProfileData(profileObj));
      const feedReqObj = {
        token: value._parts[0][1],
        index: 0,
        onSuccess: () => {
          if (payload.data.onSuccess) {
            payload.data.onSuccess(response.data);
          }
        },
        profileDataFailure: () => {
          if (payload.data.onFail) {
            payload.data.onFail();
          }
        },
      };
      yield put(ExploreAction.getFeedRequest(feedReqObj));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.followUserFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.followUserFailure(error.message));
  }
}
