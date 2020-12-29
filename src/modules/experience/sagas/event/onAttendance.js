import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onAttendance(api, payload) {
  try {
    const response = yield call(api.attendance, payload.data);
    if (response.ok) {
      yield put(Actions.attendanceSuccess(response.data));
      reqObj = {
        token: payload.data.token,
        parentID: payload.data.parentID,
        onGetEventSuccess: () => {
          if (payload.data.onSuccess) {
            payload.data.onSuccess();
          }
        },
      };
      yield put(Actions.getPostEvent(reqObj));

      let req = {
        token: payload.data.token,
        parentID: payload.data.parentID,
        onSuccess: () => {},
        onFail: () => {},
      };
      yield put(Actions.getGuestLists(req));
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
      yield put(Actions.attendanceFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.attendanceFailure(error.message));
  }
}
