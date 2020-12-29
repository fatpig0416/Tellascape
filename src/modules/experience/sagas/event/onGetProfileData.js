import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';
import apiRequest from '../../../../utils/api';
import AuthAction from '../../../auth/reducers';

export function* onGetProfileData(api, payload) {
  try {
    const response = yield call(api.getProfileData, payload.data);
    if (response.ok) {
      if (payload.data.onSuccess) {
        payload.data.onSuccess();
      }
      let eventObj = {
        response: response.data,
        payload: payload.data,
        empty: payload.data.index === 0 ? true : false,
      };
      yield put(Actions.getProfileDataSuccess(eventObj));
    } else {
      if (response.status && response.status === 403) {
        let tokenObj = {
          uid: payload.data.uid,
        };
        const tokenResponse = yield call(apiRequest.home().refreshToken, tokenObj);
        if (tokenResponse.ok) {
          yield put(AuthAction.updateToken(tokenResponse.data));
          let localObj = {
            ...payload.data,
            token: tokenResponse.data.access_token,
          };
          yield put(Actions.getProfileData(localObj));
        }
      } else {
        if (payload.data.profileDataFailure) {
          let problem = response.problem;
          if (problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') {
            payload.data.profileDataFailure('Something went wrong. Please try again.');
          } else {
            payload.data.profileDataFailure(response.data.msg);
          }
        }
        yield put(Actions.getProfileDataFailure(payload.data));
      }
    }
  } catch (error) {
    if (payload.data.profileDataFailure) {
      payload.data.profileDataFailure(error.message);
    }
    yield put(Actions.getProfileDataFailure(payload.data));
  }
}
