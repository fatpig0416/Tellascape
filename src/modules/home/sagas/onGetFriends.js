import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';

export function* onGetFriends(api, payload) {
  try {
    const response = yield call(api.friends, payload.data);
    if (response.ok) {
      yield put(Actions.getFriendsSuccess(response.data));
    } else {
      yield put(Actions.getFriendsFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.getFriendsFailure(error.message));
  }
}
