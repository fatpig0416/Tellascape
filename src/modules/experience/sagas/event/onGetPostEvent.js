import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';
import ExploreActions from '../../../home/reducers';

export function* onGetPostEvent(api, payload) {
  try {
    const response = yield call(api.getEvent, payload.data);

    if (response.ok) {
      yield put(Actions.getPostEventSuccess(response.data));
      if (payload.data.onGetEventSuccess) {
        payload.data.onGetEventSuccess(response.data);
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
        yield put(Actions.getPostEventFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.getPostEventFailure(error.message));
  }
}

export function* onSetDefaultMedia(api, payload) {
  try {
    const response = yield call(api.setDefaultMedia, payload.data);
    if (response.ok) {
      yield put(Actions.setDefaultMediaSuccess(response.data));
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
      // yield put(Actions.getPostEvent(req));
    } else {
      yield put(Actions.setDefaultMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getPostEventFailure(error.message));
  }
}

export function* onEditMedia(api, payload) {
  try {
    const response = yield call(api.editMedia, payload.data);
    if (response.ok) {
      yield put(Actions.editMediaSuccess(response.data));
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
      // yield put(Actions.getPostEvent(req));
    } else {
      yield put(Actions.editMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.editMediaFailure(error.message));
  }
}

export function* onDeleteMedia(api, payload) {
  try {
    const obj = {
      mediaID: payload.data.mediaID,
      token: payload.data.token,
      parentID: payload.data.parentID,
      childID: payload.data.childID,
      type: payload.data.type,
      userID: payload.data.userID,
      _method: payload.data._method,
    };
    const response = yield call(api.deleteMedia, obj);
    if (response.ok) {
      let req = null;
      if (payload.data.uid !== undefined && payload.data.uid !== null) {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          uid: payload.data.uid,
          onGetEventSuccess: res => {
            if (payload.data.onGetEventSuccess) {
              payload.data.onGetEventSuccess();
            }
          },
        };
      } else {
        req = {
          token: payload.data.token,
          parentID: payload.data.parentID,
          onGetEventSuccess: res => {
            if (payload.data.onGetEventSuccess) {
              payload.data.onGetEventSuccess();
            }
          },
        };
      }
      // yield put(Actions.getPostEvent(req));
      yield put(Actions.deleteMediaSuccess(response.data));
    } else {
      yield put(Actions.deleteMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.deleteMediaFailure(error.message));
  }
}

export function* onAddPostEventComment(api, payload) {
  try {
    const response = yield call(api.addPostEventComment, payload.data);
    if (response.ok) {
      if (payload.data.successComment) {
        payload.data.successComment();
      }
      yield put(Actions.addPostEventCommentSuccess(response.data));
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

      // yield put(Actions.getPostEvent(req));

      const location = payload.data.location;
      // const localReqObj = {
      //   token: payload.data.token,
      //   index: 0,
      //   cords: location.latitude + ',' + location.longitude,
      // };
      // yield put(ExploreActions.getLocalRequest(localReqObj));

      // const feedReqObj = {
      //   token: payload.data.token,
      //   index: 0,
      // };
      // yield put(ExploreActions.getFeedRequest(feedReqObj));
    } else {
      yield put(Actions.addPostEventCommentFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.addPostEventCommentFailure(error.message));
  }
}

export function* onUpdateGhostMode(api, payload) {
  try {
    const response = yield call(api.updateGhostMode, payload.data.formData);
    yield put(Actions.updateGhostSuccess(response.data));
    let req = null;
    const value = payload.data.formData;
    if (response.ok) {
      if (payload.data.updateGhostSuccess) {
        payload.data.updateGhostSuccess(response.data);
      }

      req = {
        token: value._parts[0][1],
        parentID: value._parts[1][1],
      };
      yield put(Actions.getPostEvent(req));
    } else {
      yield put(Actions.updateGhostFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.updateGhostFailure(error.message));
  }
}
