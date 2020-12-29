import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/memory/index';
import ExploreActions from '../../../home/reducers';

export function* onUpdateMemory(api, payload) {
  try {
    const response = yield call(api.updateMemory, payload.data.formData);

    if (response.ok) {
      const value = payload.data.formData;

      yield put(Actions.updateMemorySuccess(response.data));
      if (payload.data.updateMemorySuccess) {
        payload.data.updateMemorySuccess(response.data);
      }

      /* Local API request */
      const location = payload.data.location;
      const localReqObj = {
        token: value._parts[0][1],
        index: 0,
        cords: location.latitude + ',' + location.longitude,
      };
      yield put(ExploreActions.getLocalRequest(localReqObj));
      /* Local API request */

      /* My Feed */
      const feedReqObj = {
        token: value._parts[0][1],
        index: 0,
      };
      yield put(ExploreActions.getFeedRequest(feedReqObj));
      /* My Feed */
    } else {
      if (payload.data.updateMemoryFailure) {
        payload.data.updateMemoryFailure();
      }
      yield put(Actions.updateMemoryFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.updateMemoryFailure(error.message));
  }
}
