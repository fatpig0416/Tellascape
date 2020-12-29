import { call, put } from 'redux-saga/effects';
import Actions from '../reducers/index';
import NavigationService from '../../../navigation/NavigationService';

export function* onUpdateProfile(api, payload) {
  try {
    const response = yield call(api.updateProfile, payload.data);
    if (response.ok) {
      yield put(Actions.updateProfileSuccess(response.data));
      // yield NavigationService.navigate('Trending');
      yield NavigationService.navigate('Onboarding');
    } else {
      yield put(Actions.updateProfileFailure(response.data.msg));
    }
  } catch (error) {
    yield put(Actions.updateProfileFailure(error.message));
  }
}
