import Immutable from 'seamless-immutable';
/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  fetching: true,
  errorMessage: '',
  error: false,
  geofence: {},
  isStationLoad: false,
  station_data: [],
  activeStation : null,
  localStation : [],
});
