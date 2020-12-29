import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../utils/api';

/* ------------- Types ------------- */
import { AuthAction } from '../reducers/index';

/* ------------- Sagas ------------- */
import { onAuthVerify } from './onAuthVerify';
import { onUpdateProfile } from './onUpdateProfile';
import { onVerifyUsername } from './onVerifyUsername';

/* ------------- API ------------- */
const api = apiRequest.auth();

/* ------------- Connect Types To Sagas ------------- */
export default function* authWatcher() {
  yield takeLatest(AuthAction.VERIFY_TOKEN, onAuthVerify, api);
  yield takeLatest(AuthAction.VERIFY_USERNAME, onVerifyUsername, api);
  yield takeLatest(AuthAction.UPDATE_PROFILE, onUpdateProfile, api);
}
