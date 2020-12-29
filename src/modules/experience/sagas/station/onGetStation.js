import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/station/index';

export function* onGetStation(api, payload) {
  try {
    const response = yield call(api.getStation, payload.data);
    if (response.ok) {
      yield put(Actions.getStationSuccess(response.data));
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data);
      }
    } else {
      if (payload.data.onFail) {
        let problem = response.problem;
        if (problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') {
          payload.data.onFail('Something went wrong. Please try again.', response.status);
        } else {
          payload.data.onFail(response.data.msg, response.status);
        }
      }
      if (response.data != null) {
        yield put(Actions.getStationFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.getStationFailure(error.message));
  }
}

export function* onAddStationComment(api, payload) {
  try {
    const response = yield call(api.addPostEventComment, payload.data);
    if (response.ok) {
      if (payload.data.successComment) {
        payload.data.successComment();
      }
      yield put(Actions.addStationCommentSuccess(response.data));
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

      // yield put(Actions.getStation(req));
    } else {
      yield put(Actions.addStationCommentFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.addStationCommentFailure(error.message));
  }
}

export function* onSetDefaultStationMedia(api, payload) {
  try {
    const response = yield call(api.setDefaultMedia, payload.data);
    if (response.ok) {
      let req = null;
      if (payload.data.uid !== undefined && payload.data.uid !== null) {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          uid: payload.data.uid,
        };
      } else {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
        };
      }
      // yield put(Actions.getStation(req));
    } else {
    }
  } catch (error) {}
}

export function* onDeleteMedia(api, payload) {
  try {
    const obj = {
      mediaID: payload.data.mediaID,
      token: payload.data.token,
      parentID: payload.data.parentID,
      childID: payload.data.childID,
      _method: 'DELETE',
      type: payload.data.type,
      userID: payload.data.userID,
    };
    const response = yield call(api.deleteMedia, obj);
    if (response.ok) {
      let req = null;
      if (payload.data.uid !== undefined && payload.data.uid !== null) {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          uid: payload.data.uid,
          onSuccess: res => {
            if (payload.data.onSuccess) {
              payload.data.onSuccess();
            }
          },
        };
      } else {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          onSuccess: res => {
            if (payload.data.onSuccess) {
              payload.data.onSuccess();
            }
          },
        };
      }
      // yield put(Actions.getStation(req));
      yield put(Actions.deleteStationMediaSuccess(response.data));
    } else {
      yield put(Actions.deleteStationMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.deleteStationMediaFailure(error.message));
  }
}

export function* onEditMedia(api, payload) {
  try {
    const response = yield call(api.editMedia, payload.data);
    if (response.ok) {
      yield put(Actions.editStationMediaSuccess(response.data));
      let req = null;
      if (payload.data.uid !== undefined && payload.data.uid !== null) {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          uid: payload.data.uid,
        };
      } else {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
        };
      }
      // yield put(Actions.getStation(req));
    } else {
      yield put(Actions.editStationMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.editStationMediaFailure(error.message));
  }
}
