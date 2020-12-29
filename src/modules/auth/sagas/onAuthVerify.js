import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import NavigationService from '../../../navigation/NavigationService';

export function* onAuthVerify(api, payload) {
  try {
    const response = yield call(api.verifyAuth, payload.data);
    if (response.ok) {
      yield put(Actions.verifyTokenSuccess(response.data));
      yield NavigationService.navigate('Profile');
    } else {
      yield put(Actions.verifyTokenFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.verifyTokenFailure(error.message));
  }
}
