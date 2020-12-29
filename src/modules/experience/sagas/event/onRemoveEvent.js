import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';
import ExploreAction from '../../../home/reducers/index';

export function* onRemoveEvent(api, payload) {
  try {
    const response = yield call(api.removeEvent, payload.data);
    if (response.status === 200) {
      const location = payload.data.location;
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
      const profileObj = {
        token: payload.data.token,
        uid: payload.data.uid,
        index: 0,
      };
      yield put(Actions.getProfileData(profileObj));
      // const feedReqObj = {
      //   token: payload.data.token,
      //   index: 0,
      // };
      // yield put(ExploreAction.getFeedRequest(feedReqObj));

      // const amazingReqObj = {
      //   token: payload.data.token,
      //   lat: location !== null ? location.latitude : null,
      //   lng: location !== null ? location.longitude : null,
      // };
      // yield put(ExploreAction.getAmazingsRequest(amazingReqObj));

    } else {
      if (payload.data.onFail) {
        payload.data.onFail(response.data.msg);
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
  }
}
