import Immutable from 'seamless-immutable';
/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  fetching: true,
  errorMessage: '',
  error: false,
  geofence: {},
  isAlertLoad: false,
  alert_data: [],
  activeAlert: null,
  localAlert: [],
});
