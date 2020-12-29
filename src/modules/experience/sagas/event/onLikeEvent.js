import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';
import ExploreActions from '../../../home/reducers';

export function* onLikeEvent(api, payload) {
  try {
    const response = yield call(api.likeEvent, payload.data.formData);
    if (response.ok) {
      let req = null;
      const { formData } = payload.data;
      if (formData._parts[4] !== undefined && formData._parts[4][1] !== null) {
        req = {
          token: formData._parts[0][1],
          parentID: formData._parts[1][1],
          uid: formData._parts[4][1],
          onGetEventSuccess: res => {
            if (payload.data.onGetEventSuccess) {
              payload.data.onGetEventSuccess();
              if (payload.data.onSuccess) {
                payload.data.onSuccess(response.data);
              }
            }
          },
        };
      } else {
        req = {
          token: formData._parts[0][1],
          parentID: formData._parts[1][1],
          onGetEventSuccess: res => {
            if (payload.data.onGetEventSuccess) {
              payload.data.onGetEventSuccess();
              if (payload.data.onSuccess) {
                payload.data.onSuccess(response.data);
              }
            }
          },
        };
      }
      // yield put(Actions.getPostEvent(req));

      const location = payload.data.location;
      // const localReqObj = {
      //   token: payload.data.formData._parts[0][1],
      //   index: 0,
      //   cords: location.latitude + ',' + location.longitude,
      // };
      // yield put(ExploreActions.getLocalRequest(localReqObj));

      // const feedReqObj = {
      //   token: payload.data.formData._parts[0][1],
      //   index: 0,
      // };
      // yield put(ExploreActions.getFeedRequest(feedReqObj));

      //  yield put(Actions.likeEventSuccess(response.data));
    } else {
      yield put(Actions.likeEventFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.likeEventFailure(error.message));
  }
}
