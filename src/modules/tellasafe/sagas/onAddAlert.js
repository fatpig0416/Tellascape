import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import ExploreActions from '../../home/reducers';
import ExperienceActions from '../../experience/reducers/event';

export function* onAddAlert(api, payload) {
  try {
    const response = yield call(api.createAlert, payload.data.formData);
    if (response.ok) {
      const value = payload.data.formData;
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

      /* Markers */
      const markerReqObj = {
        token: value._parts[0][1],
      };
      yield put(ExploreActions.getMarkersRequest(markerReqObj));

      const obj = {
        response,
        payload: payload.data,
      };
      yield put(Actions.addAlertSuccess(obj));
    } else {
      yield put(Actions.addAlertFailure(payload.data));
    }
  } catch (error) {
    yield put(Actions.addAlertFailure(payload.data));
  }
}
