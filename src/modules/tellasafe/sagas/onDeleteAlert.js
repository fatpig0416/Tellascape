import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import ExploreActions from '../../home/reducers';
import ExperienceActions from '../../experience/reducers/event';

export function* onDeleteAlert(api, payload) {
  try {
    const response = yield call(api.deleteAlert, payload.data);
    if (response.status === 200) {
      if (payload.data.type && payload.data.type === 'explore' && payload.data.onSuccessMarkers) {
        const markerObj = {
          token: payload.data.token,
          onSuccess: () => payload.data.onSuccessMarkers(),
        };
        yield put(ExploreActions.getMarkersRequest(markerObj));
      }

      const profileObj = {
        token: payload.data.token,
        uid: payload.data.uid,
        index: 0,
        profileDataSuccess: () => {
          if (payload.data.onSuccess) {
            payload.data.onSuccess();
          }
        },
        profileDataFailure: () => {
          if (payload.data.onFail) {
            payload.data.onFail(response.data.msg);
          }
        },
      };
      yield put(ExperienceActions.getProfileData(profileObj));
      const feedReqObj = {
        token: payload.data.token,
        index: 0,
      };
      yield put(ExploreActions.getFeedRequest(feedReqObj));
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
