import Immutable from 'seamless-immutable';
/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  fetching: true,
  errorMessage: '',
  error: false,
  data: [],
  badgeCount: 0,
  request_list: [],
  accepted_stack: [],
  invited_stack: [],
  planned_stack: [],
});
