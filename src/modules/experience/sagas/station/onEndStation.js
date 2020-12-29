import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';
import HomeAction from '../../../home/reducers/index';

export function* onEndStation(api, payload) {
  try {
    const response = yield call(api.endStation, payload.data.formData);
    if (response.ok) {
      const value = payload.data.formData;
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
    }
  } catch (error) {
    console.log(`error is: `, error);
  }
}
