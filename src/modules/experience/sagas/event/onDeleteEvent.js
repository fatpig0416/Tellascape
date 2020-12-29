import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';
import HomeAction from '../../../home/reducers/index';

export function* onDeleteEvent(api, payload) {
  try {
    const response = yield call(api.deleteEvent, payload.data.formData);
    if (response.ok) {
      yield put(Actions.deleteEventSuccess(response.data));
      const value = payload.data;
      const obj = {
        token: value._parts[0][1],
        uid: value._parts[1][1],
        index: 0,
      };
      yield put(Actions.getProfileData(obj));

      // const exploreReqObj = {
      //   token: value._parts[0][1],
      // };
      // yield put(HomeAction.getMarkersRequest(exploreReqObj));

      // const location = payload.data.location;

      // const amazingReqObj = {
      //   token: value._parts[0][1],
      //   lat: location !== null ? location.latitude : null,
      //   lng: location !== null ? location.longitude : null,
      // };
      // yield put(HomeAction.getAmazingsRequest(amazingReqObj));
    } else {
      yield put(Actions.deleteEventFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.deleteEventFailure(error.message));
  }
}
