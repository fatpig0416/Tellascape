import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetAlert(api, payload) {
  try {
    const response = yield call(api.getAlert, payload.data);
    if (response.ok) {
      yield put(Actions.getAlertSuccess(response.data));
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
    } else {
      if (payload.data.onFail) {
        payload.data.onFail(response.data.msg, response.status);
      }
      yield put(Actions.getAlertFailure(response.data.msg));
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.getAlertFailure(error.message));
  }
}

export function* onAddAlertComment(api, payload) {
  try {
    const response = yield call(api.addPostEventComment, payload.data);
    if (response.ok) {
      if (payload.data.successComment) {
        payload.data.successComment();
      }
      yield put(Actions.addAlertCommentSuccess(response.data));
      let req = null;
      if (payload.data.uid === null) {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
        };
      } else {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          uid: payload.data.uid,
        };
      }

      yield put(Actions.getAlert(req));
    } else {
      yield put(Actions.addAlertCommentFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.addAlertCommentFailure(error.message));
  }
}
