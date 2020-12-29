import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import AuthAction from '../../auth/reducers';

export function* onGetLocal(api, payload) {
  try {
    const response = yield call(api.local, payload.data);
    if (response.ok) {
      if (payload.data.onSucess) {
        payload.data.onSucess(response.data.data);
      }
      let obj = {
        data: response.data.data,
        empty: payload.data.index === 0 ? true : false,
      };
      yield put(Actions.getLocalSuccess(obj));
    } else {
      if (response.status && response.status === 403) {
        let tokenObj = {
          uid: payload.data.uid,
        };
        const tokenResponse = yield call(api.refreshToken, tokenObj);
        if (tokenResponse.ok) {
          yield put(AuthAction.updateToken(tokenResponse.data));
          let localObj = {
            ...payload.data,
            token: tokenResponse.data.access_token,
          };
          yield put(Actions.getLocalRequest(localObj));
        }
      } else {
        if (payload.data.onFail) {
          payload.data.onFail();
        }
        yield put(Actions.getLocalFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.getLocalFailure(error.message));
  }
}
