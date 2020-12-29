import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import ExploreActions from '../../home/reducers';
import ExperienceActions from '../../experience/reducers/event';

export function* onEditAlert(api, payload) {
  try {
    const response = yield call(api.editAlert, payload.data.formData);
    if (response.ok) {
      const value = payload.data.formData;

      /* Markers */
      const markerReqObj = {
        token: value._parts[0][1],
        onSuccess: () => {
          if (payload.data.onSuccess) {
            payload.data.onSuccess();
          }
        },
      };
      yield put(ExploreActions.getMarkersRequest(markerReqObj));

      const profileObj = {
        token: value._parts[0][1],
        uid: value._parts[1][1],
        index: 0,
      };
      yield put(ExperienceActions.getProfileData(profileObj));

      /* Local API request */
      const location = payload.data.location;
      const localReqObj = {
        token: value._parts[0][1],
        index: 0,
        cords: location.latitude + ',' + location.longitude,
      };
      yield put(ExploreActions.getLocalRequest(localReqObj));

      /* My Feed */
      const feedReqObj = {
        token: value._parts[0][1],
        index: 0,
      };
      yield put(ExploreActions.getFeedRequest(feedReqObj));

      const obj = {
        response,
        payload: payload.data,
      };
      yield put(Actions.editAlertSuccess(obj));
    } else {
      if (payload.data.onFail) {
        let problem = response.problem;
        if (problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') {
          payload.data.onFail('Something went wrong. Please try again.');
        } else {
          payload.data.onFail(response.data.msg);
        }
      }
      if (response.data != null) {
      yield put(Actions.editAlertFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.editAlertFailure(error.message));
  }
}
