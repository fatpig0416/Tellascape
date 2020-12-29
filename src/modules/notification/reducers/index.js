import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../initialState';
import { static as Immutable } from 'seamless-immutable';
import { createSelector } from 'reselect';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    notification: ['data'],
    notificationSuccess: ['response'],
    notificationFailure: ['error'],

    experienceStatus: ['data'],
    experienceStatusSuccess: ['response'],
    experienceStatusFailure: ['error'],

    acceptRequest: ['data'],
    acceptRequestSuccess: ['response'],
    acceptRequestFailure: ['error'],

    denyRequest: ['data'],
    denyRequestSuccess: ['response'],
    denyRequestFailure: ['error'],

    setBadgeCount: ['data'],
  },
  {}
);

export const NotificationAction = Types;
export default Creators;

/* ------------- Reducers ------------- */

export const notification = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const notificationFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const notificationSuccess = (state, action) => {
  return Immutable.merge(state, {
    access_token: action.response.access_token,
    error: false,
    errorMessage: '',
    fetching: false,
    data: action.response.data,
    request_list: action.response.follower_req,
    accepted_stack: action.response.accepted_stack,
    invited_stack: action.response.invited_stack,
    planned_stack: action.response.planned_stack,
  });
};

/** Experience Status */
export const experienceStatus = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const experienceStatusFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const experienceStatusSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/** Accept Request */

export const acceptRequest = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const acceptRequestFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const acceptRequestSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/** Deny Request */

export const denyRequest = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const denyRequestFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const denyRequestSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const setBadgeCount = (state, action) => {
  return Immutable.merge(state, {
    badgeCount: action.data,
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.NOTIFICATION]: notification,
  [Types.NOTIFICATION_SUCCESS]: notificationSuccess,
  [Types.NOTIFICATION_FAILURE]: notificationFailure,
  [Types.EXPERIENCE_STATUS]: experienceStatus,
  [Types.EXPERIENCE_STATUS_SUCCESS]: experienceStatusSuccess,
  [Types.EXPERIENCE_STATUS_FAILURE]: experienceStatusFailure,
  [Types.ACCEPT_REQUEST]: acceptRequest,
  [Types.ACCEPT_REQUEST_SUCCESS]: acceptRequestSuccess,
  [Types.ACCEPT_REQUEST_FAILURE]: acceptRequestFailure,
  [Types.DENY_REQUEST]: denyRequest,
  [Types.DENY_REQUEST_SUCCESS]: denyRequestSuccess,
  [Types.DENY_REQUEST_FAILURE]: denyRequestFailure,
  [Types.SET_BADGE_COUNT]: setBadgeCount,
});
