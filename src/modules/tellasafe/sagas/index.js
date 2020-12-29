import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../utils/api';

/* ------------- Types ------------- */
import { AlertActions } from '../reducers/index';

/* ------------- Sagas ------------- */
import { onAddAlert } from './onAddAlert';
import { onEditAlert } from './onEditAlert';
import { onGetAlert, onAddAlertComment } from './onGetAlert';
import { onDeleteAlert } from './onDeleteAlert';
// import { onJoinAlert } from './onJoinAlert';
import { onSaveSettings } from './onSaveSettings';
import { onGetSettings } from './onGetSettings';
import { onSendAlert } from './onSendAlert';

/* ------------- API ------------- */
const api = apiRequest.tellasafe();
const eventApi = apiRequest.events();
/* ------------- Connect Types To Sagas ------------- */
export default function* tellasafeWatcher() {
  yield takeLatest(AlertActions.ADD_ALERT, onAddAlert, api);
  yield takeLatest(AlertActions.EDIT_ALERT, onEditAlert, api);
  yield takeLatest(AlertActions.GET_ALERT, onGetAlert, api);
  yield takeLatest(AlertActions.SEND_ALERT, onSendAlert, api);
  yield takeLatest(AlertActions.DELETE_ALERT, onDeleteAlert, api);
  yield takeLatest(AlertActions.SAVE_SETTINGS, onSaveSettings, api);
  yield takeLatest(AlertActions.GET_SETTINGS, onGetSettings, api);
  yield takeLatest(AlertActions.ADD_ALERT_COMMENT, onAddAlertComment, eventApi);

  //   yield takeLatest(AlertActions.JOIN_ALERT, onJoinAlert, api);
}
