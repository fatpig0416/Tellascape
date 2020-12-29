import { call, put } from 'redux-saga/effects';
import Actions from '../../reducers/event/index';

export function* onVerifyPin(api, payload) {
  try {
    const response = yield call(api.verifyPin, payload.data);
    if (response.status === 200) {
      if (response.ok) {
        if (payload.data.onSuccess) {
          payload.data.onSuccess(response.data);
        }
      } else {
        if (payload.data.onFail) {
          let problem = response.problem;
          if (problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') {
            payload.data.onFail('Something went wrong. Please try again.');
          } else {
            payload.data.onFail(response.data.msg);
          }
        }
      }
    } else {
      if (payload.data.onFail) {
        let problem = response.problem;
        if (problem === 'NETWORK_ERROR' || problem === 'TIMEOUT_ERROR') {
          payload.data.onFail('Something went wrong. Please try again.');
        } else {
          payload.data.onFail(response.data.msg);
        }
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail(error.message);
    }
  }
}
