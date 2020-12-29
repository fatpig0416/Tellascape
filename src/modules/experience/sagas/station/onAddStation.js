import { call, put } from 'redux-saga/effects';
import ExploreActions from '../../../home/reducers';
import ExperienceActions from '../../reducers/event';
import Actions from '../../reducers/station';

export function* onAddStation(api, payload) {
  try {
    const response = yield call(api.createStation, payload.data.formData);
    if (response.ok) {
      const value = payload.data.formData;
      // const profileObj = {
      //   token: value._parts[0][1],
      //   uid: value._parts[1][1],
      //   index: 0,
      // };
      // yield put(ExperienceActions.getProfileData(profileObj));

      /* Local API request */
      const location = payload.data.location;
      if (location !== null) {
        const localReqObj = {
          token: value._parts[0][1],
          index: 0,
          cords: location.latitude + ',' + location.longitude,
        };
        yield put(ExploreActions.getLocalRequest(localReqObj));
      }
      /* Local API request */

      /* My Feed */
      const feedReqObj = {
        token: value._parts[0][1],
        index: 0,
      };
      yield put(ExploreActions.getFeedRequest(feedReqObj));
      /* My Feed */

      /* Markers */
      // const markerReqObj = {
      //   token: value._parts[0][1],
      // };
      // yield put(ExploreActions.getMarkersRequest(markerReqObj));
      /* Markers */

      const stationObj = {
        response,
        payload: payload.data,
      };
      yield put(Actions.addStationSuccess(stationObj));
    } else {
      yield put(Actions.addStationFailure(payload.data));
    }
  } catch (error) {
    yield put(Actions.addStationFailure(payload.data));
  }
}
