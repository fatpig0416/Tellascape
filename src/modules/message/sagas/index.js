import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../utils/api';

/* ------------- Types ------------- */
import { ContactAction } from '../reducers/index';

/* ------------- Sagas ------------- */
import { onGetContacts } from './onGetContacts';

/* ------------- API ------------- */
const api = apiRequest.messages();

/* ------------- Connect Types To Sagas ------------- */
export default function* messageWatcher() {
  yield takeLatest(ContactAction.GET_CONTACT, onGetContacts, api);
}
