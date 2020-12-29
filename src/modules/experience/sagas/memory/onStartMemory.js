import { call, put } from 'redux-saga/effects';
import ExploreActions from '../../../home/reducers';
import ExperienceActions from '../../reducers/event';
import Actions from '../../reducers/memory';

export function* onStartMemory(api, payload) {
  try {
    const response = yield call(api.startMemory, payload.data.formData);
    if (response.ok) {
      if (payload.data.startMemorySuccess) {
        payload.data.startMemorySuccess(response.data);
      }
      const value = payload.data.formData;

      /* Profile API request */
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

      const memoryObj = {
        response,
        payload: payload.data,
      };
      yield put(Actions.startMemorySuccess(memoryObj));
    } else {
      if (payload.data.startMemoryFailure) {
        payload.data.startMemoryFailure();
      }
    }
  } catch (error) {
    if (payload.data.startMemoryFailure) {
      payload.data.startMemoryFailure();
    }
  }
}
