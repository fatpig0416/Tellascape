import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import AuthAction from '../../auth/reducers';

export function* onGetFeed(api, payload) {
  try {
    const response = yield call(api.feed, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess(response.data.data);
      }
      let obj = {
        data: response.data.data,
        empty: payload.data.index === 0 ? true : false,
      };
      yield put(Actions.getFeedSuccess(obj));
    } else {
      if (response.status && response.status === 403) {
        let tokenObj = {
          uid: payload.data.uid,
        };
        const tokenResponse = yield call(api.refreshToken, tokenObj);
        if (tokenResponse.ok) {
          yield put(AuthAction.updateToken(tokenResponse.data));
          let feedObj = {
            ...payload.data,
            token: tokenResponse.data.access_token,
          };
          yield put(Actions.getFeedRequest(feedObj));
        }
      } else {
        if (payload.data.onFail) {
          payload.data.onFail();
        }
        yield put(Actions.getFeedFailure(response.data.msg));
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
    yield put(Actions.getFeedFailure(error.message));
  }
}
