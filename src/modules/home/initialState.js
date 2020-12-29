import Immutable from 'seamless-immutable';
/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  fetching: true,
  errorMessage: '',
  error: false,
  data: [],
  feed: [],
  local: [],
  markers: [],
  amazings: [],
  joinedEventsList: [],
  peoples: [],
  localSendAlert: [],
});
