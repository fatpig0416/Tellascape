import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event';
import HomeAction from '../../../home/reducers/index';

export function* onEndMemory(api, payload) {
  try {
    const response = yield call(api.endMemory, payload.data.formData);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
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
      if (payload.data.onFail) {
        if (response.data && response.data.msg) {
          payload.data.onFail(response.data.msg);
        } else {
          payload.data.onFail('Something went wrong. Please try again later.');
        }
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    console.log(`error is: ${JSON.stringify(error)}`);
  }
}
