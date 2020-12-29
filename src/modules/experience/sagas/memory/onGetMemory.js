import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/memory';

export function* onGetMemory(api, payload) {
  try {
    const response = yield call(api.getMemory, payload.data);
    if (response.ok) {
      yield put(Actions.getMemorySuccess(response.data));
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
        yield put(Actions.getMemoryFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
    yield put(Actions.getMemoryFailure(error.message));
  }
}

export function* onAddMemoryComment(api, payload) {
  try {
    const response = yield call(api.addPostEventComment, payload.data);
    if (response.ok) {
      if (payload.data.successComment) {
        payload.data.successComment();
      }
      yield put(Actions.addMemoryCommentSuccess(response.data));
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

      // yield put(Actions.getMemory(req));
    } else {
      yield put(Actions.addMemoryCommentFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.addMemoryCommentFailure(error.message));
  }
}

export function* onSetDefaultMemoryMedia(api, payload) {
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
      // yield put(Actions.getMemory(req));
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
      userID : payload.data.userID,
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
      // yield put(Actions.getMemory(req));
      yield put(Actions.deleteMemoryMediaSuccess(response.data));
    } else {
      yield put(Actions.deleteMemoryMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.deleteMemoryMediaFailure(error.message));
  }
}

export function* onEditMedia(api, payload) {
  try {
    const response = yield call(api.editMedia, payload.data);
    if (response.ok) {
      yield put(Actions.editMemoryMediaSuccess(response.data));
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
      // yield put(Actions.getMemory(req));
    } else {
      yield put(Actions.editMemoryMediaFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.editMemoryMediaFailure(error.message));
  }
}
