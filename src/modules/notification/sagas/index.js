import { takeLatest } from 'redux-saga/effects';
import apiRequest from '../../../utils/api';

/* ------------- Types ------------- */
import { NotificationAction } from '../reducers/index';

/* ------------- Sagas ------------- */
import { onGetNotification } from './onGetNotification';
import { onGetExperienceStatus } from './onGetExperienceStatus';
import { onAcceptRequest } from './onAcceptRequest';
import { onDenyRequest } from './onDenyRequest';

/* ------------- API ------------- */
const api = apiRequest.notification();

/* ------------- Connect Types To Sagas ------------- */
export default function* notificationWatcher() {
  yield takeLatest(NotificationAction.NOTIFICATION, onGetNotification, api);
  yield takeLatest(NotificationAction.EXPERIENCE_STATUS, onGetExperienceStatus, api);
  yield takeLatest(NotificationAction.ACCEPT_REQUEST, onAcceptRequest, api);
  yield takeLatest(NotificationAction.DENY_REQUEST, onDenyRequest, api);
}
