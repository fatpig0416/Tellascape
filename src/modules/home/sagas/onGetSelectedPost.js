import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetSelectedPost(api, payload) {
  try {
    const response = yield call(api.selectedPost, payload.data);
    if (response.ok) {
        if(payload.data.onSuccess){
            payload.data.onSuccess(response.data);
        }
    } else {
      if (payload.data.onFail) {
        payload.data.onFail();
      }
    }
  } catch (error) {
    if (payload.data.onFail) {
      payload.data.onFail();
    }
  }
}
