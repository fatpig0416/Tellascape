import { call, put } from 'redux-saga/effects';
import Actions, { ExperienceActions } from '../../reducers/event/index';
import ExploreActions from '../../../home/reducers/index';

export function* onAddEvent(api, payload) {
  try {
    const response = yield call(api.createEvent, payload.data.formData);
    if (response.ok) {
      /* Call the Profile sagas to get the latest inserted experience to display in Profiles */
      const value = payload.data.formData;
      // const profileObj = {
      //   token: value._parts[0][1],
      //   uid: value._parts[1][1],
      //   index: 0,
      // };
      // yield put(Actions.getProfileData(profileObj));

      /** Local  */
      const location = payload.data.location;
      if (location !== null) {
        const localReqObj = {
          token: value._parts[0][1],
          index: 0,
          cords: location.latitude + ',' + location.longitude,
        };
        yield put(ExploreActions.getLocalRequest(localReqObj));
      }

      /** Local */

      /** My Feed */
      const feedReqObj = {
        token: value._parts[0][1],
        index: 0,
      };
      yield put(ExploreActions.getFeedRequest(feedReqObj));
      /** My Feed */

      // const markerReqObj = {
      //   token: value._parts[0][1],
      // };
      // yield put(ExploreActions.getMarkersRequest(markerReqObj));

      const amazingReqObj = {
        token: value._parts[0][1],
        lat: location !== null ? location.latitude : null,
        lng: location !== null ? location.longitude : null,
      };
      yield put(ExploreActions.getAmazingsRequest(amazingReqObj));

      const eventObj = {
        response,
        payload: payload.data,
      };
      /* Handle the Event Success Response to update the Props */
      yield put(Actions.addEventSuccess(eventObj));
    } else {
      yield put(Actions.addEventFailure(payload.data));
    }
  } catch (error) {
    yield put(Actions.addEventFailure(payload.data));
  }
}
