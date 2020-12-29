import Immutable from 'seamless-immutable';
/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  fetching: true,
  errorMessage: '',
  error: false,
  geofence: {},
  isMemoryLoad: false,
  memory_data: [],
  activeMemory: null,
  localMemory: [],
  isQuickMemoryStarted: false,
});
