import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../initialState';
import { static as Immutable } from 'seamless-immutable';
import { createSelector } from 'reselect';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    // Add Alert
    addAlert: ['data'],
    addAlertSuccess: ['response'],
    addAlertFailure: ['response'],

    // Edit Alert
    editAlert: ['data'],
    editAlertSuccess: ['response'],
    editAlertFailure: ['response'],

    // Delete Alert
    deleteAlert: ['data'],
    deleteAlertSuccess: ['response'],
    deleteAlertFailure: ['error'],

    // Get Alert
    getAlert: ['data'],
    getAlertSuccess: ['response'],
    getAlertFailure: ['error'],

    // Add Comment Media
    addAlertComment: ['data'],
    addAlertCommentSuccess: ['response'],
    addAlertCommentFailure: ['error'],

    // Save settings
    saveSettings: ['data'],
    saveSettingsSuccess: ['response'],
    saveSettingsFailure: ['error'],

    // Get settings
    getSettings: ['data'],
    getSettingsSuccess: ['response'],
    getSettingsFailure: ['error'],

    // Send Alert
    sendAlert: ['data'],
    sendAlertSuccess: ['response'],
    sendAlertFailure: ['error'],

    joinAlert: ['data'],

    // Set Geofence
    setGeofence: ['geofence'],

    // Alert Load
    setAlertLoad: ['alertLoad'],

    // Active Experience
    setActiveAlert: ['activeAlert'],

    // Local Alert
    setLocalAlert: ['localAlert'],
  },
  {}
);

export const AlertActions = Types;
export default Creators;

/* ------------- Reducers ------------- */

/* Create Alert */
export const addAlert = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addAlertFailure = (state, action) => {
  action.response.addAlertFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addAlertSuccess = (state, action) => {
  action.response.payload.addAlertSuccess(action.response.response);
  return Immutable.set(state, {
    fetching: false,
    error: false,
  });
};

/* Edit Alert */
export const editAlert = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const editAlertFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const editAlertSuccess = (state, action) => {
  return Immutable.set(state, {
    fetching: false,
    error: false,
  });
};

/* Get Alert */
export const getAlert = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getAlertFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getAlertSuccess = (state, action) => {
  return Immutable.merge(state, {
    alert_data: action.response,
    isAlertLoad: true,
  });
};

/* Send Alert */
export const sendAlert = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const sendAlertFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const sendAlertSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
  });
};

/* Delete Alert */
export const deleteAlert = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteAlertFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const deleteAlertSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

// Add Post Comment

export const addAlertComment = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addAlertCommentFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addAlertCommentSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

export const joinAlert = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setAlertLoad = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    isAlertLoad: action.alertLoad,
  });
};

export const setGeofence = (state, action) => {
  return Immutable.merge(state, {
    geofence: action.geofence,
    shape: action.shape,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const setActiveAlert = (state, action) => {
  return Immutable.merge(state, {
    activeAlert: action.activeAlert,
  });
};

export const setLocalAlert = (state, action) => {
  return Immutable.merge(state, {
    localAlert: action.localAlert,
  });
};

export const saveSettings = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const saveSettingsFailure = (state, action) => {
  action.response.saveSettingsFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/* Get Settings */
export const getSettings = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getSettingsFailure = (state, action) => {
  // action.response.getSettingsFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getSettingsSuccess = (state, action) => {
  // action.response.payload.getSettingsSuccess(action.response.response);
  return Immutable.merge(state, {
    settings: action.response.data,
  });
};

export const saveSettingsSuccess = (state, action) => {
  action.response.payload.saveSettingsSuccess(action.response.response);
  return Immutable.merge(state, {
    fetching: false,
  });
};

const selectSafe = state => state.tellasafe;

export const selectGeofence = createSelector(
  [selectSafe],
  tellasafe => tellasafe.geofence
);
export const selectSettings = createSelector(
  [selectSafe],
  tellasafe => tellasafe.settings
);

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_ALERT]: addAlert,
  [Types.ADD_ALERT_SUCCESS]: addAlertSuccess,
  [Types.ADD_ALERT_FAILURE]: addAlertFailure,

  [Types.EDIT_ALERT]: editAlert,
  [Types.EDIT_ALERT_SUCCESS]: editAlertSuccess,
  [Types.EDIT_ALERT_FAILURE]: editAlertFailure,

  [Types.GET_ALERT]: getAlert,
  [Types.GET_ALERT_SUCCESS]: getAlertSuccess,
  [Types.GET_ALERT_FAILURE]: getAlertFailure,

  [Types.SEND_ALERT]: sendAlert,
  [Types.SEND_ALERT_SUCCESS]: sendAlertSuccess,
  [Types.SEND_ALERT_FAILURE]: sendAlertFailure,

  [Types.DELETE_ALERT]: deleteAlert,
  [Types.DELETE_ALERT_SUCCESS]: deleteAlertSuccess,
  [Types.DELETE_ALERT_FAILURE]: deleteAlertFailure,

  [Types.ADD_ALERT_COMMENT]: addAlertComment,
  [Types.ADD_ALERT_COMMENT_SUCCESS]: addAlertCommentSuccess,
  [Types.ADD_ALERT_COMMENT_FAILURE]: addAlertCommentFailure,

  [Types.JOIN_ALERT]: joinAlert,

  [Types.SET_ALERT_LOAD]: setAlertLoad,
  [Types.SET_GEOFENCE]: setGeofence,

  [Types.SET_ACTIVE_ALERT]: setActiveAlert,
  [Types.SET_LOCAL_ALERT]: setLocalAlert,

  [Types.SAVE_SETTINGS]: saveSettings,
  [Types.SAVE_SETTINGS_SUCCESS]: saveSettingsSuccess,
  [Types.SAVE_SETTINGS_FAILURE]: saveSettingsFailure,

  [Types.GET_SETTINGS]: getSettings,
  [Types.GET_SETTINGS_SUCCESS]: getSettingsSuccess,
  [Types.GET_SETTINGS_FAILURE]: getSettingsFailure,
});
