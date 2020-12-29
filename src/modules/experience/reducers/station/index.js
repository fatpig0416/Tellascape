import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../../stationInitialState';
import { static as Immutable } from 'seamless-immutable';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    // Add Station
    addStation: ['data'],
    addStationSuccess: ['response'],
    addStationFailure: ['response'],

    // Update Station
    updateStation: ['data'],
    updateStationSuccess: ['response'],
    updateStationFailure: ['error'],

    // Leave Station
    leaveStation: ['data'],
    leaveStationSuccess: ['response'],
    leaveStationFailure: ['error'],

    // Delete Station
    deleteStation: ['data'],
    deleteStationSuccess: ['response'],
    deleteStationFailure: ['error'],

    // Delete Station
    endStation: ['data'],

    // Get Station
    getStation: ['data'],
    getStationSuccess: ['response'],
    getStationFailure: ['error'],

    // Like Event
    likeStation: ['data'],
    likeStationSuccess: ['response'],
    likeStationFailure: ['error'],

    // Add Comment Media
    addStationComment: ['data'],
    addStationCommentSuccess: ['response'],
    addStationCommentFailure: ['error'],

    // Delete Event
    deleteStationMedia: ['data'],
    deleteStationMediaSuccess: ['response'],
    deleteStationMediaFailure: ['error'],

    // Edit Media
    editStationMedia: ['data'],
    editStationMediaSuccess: ['response'],
    editStationMediaFailure: ['error'],

    // Upload Video
    uploadStationVideo: ['data'],
    uploadStationVideoSuccess: ['response'],
    uploadStationVideoFailure: ['error'],

    // Upload Image
    uploadStationImage: ['data'],
    uploadStationImageSuccess: ['response'],
    uploadStationImageFailure: ['error'],

    joinStation: ['data'],

    // Set Default Media
    setDefaultStationMedia: ['data'],

    // Set Geofence
    setGeofence: ['geofence'],

    // Event Load
    setStationLoad: ['stationLoad'],

    // Active Experience
    setActiveStation: ['activeStation'],

    // Local Station
    setLocalStation: ['localStation'],
  },
  {}
);

export const StationActions = Types;
export default Creators;

/* ------------- Reducers ------------- */

/* Create Station */
export const addStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addStationFailure = (state, action) => {
  action.response.addStationFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addStationSuccess = (state, action) => {
  action.response.payload.addStationSuccess(action.response.response);
  return Immutable.set(state, {
    fetching: false,
    error: false,
  });
};

/* Update Station */
export const updateStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const updateStationFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const updateStationSuccess = (state, action) => {
  // const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  // return Immutable.merge(state, {
  //   data: Immutable(filterEvents).concat(action.response),
  // });
  return Immutable.merge(state, {
    fetching: false,
    error: false,
  });
};

/* Get Station */
export const getStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getStationFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getStationSuccess = (state, action) => {
  return Immutable.merge(state, {
    station_data: action.response,
    isStationLoad: true,
  });
};

/* Leave Station */
export const leaveStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const leaveStationFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const leaveStationSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

/* Delete Station */
export const deleteStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteStationFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const deleteStationSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

/* Delete Station */
export const endStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

/* Like Event Media */
export const likeStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const likeStationFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const likeStationSuccess = (state, action) => {
  return Immutable.merge(state, {
    likes: action.response.likes,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

// Add Post Comment

export const addStationComment = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addStationCommentFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addStationCommentSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

/* Delete Media */
export const deleteStationMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteStationMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const deleteStationMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

/* Edit Media */
export const editStationMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const editStationMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const editStationMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

export const uploadStationVideo = (state, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const uploadStationVideoFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const uploadStationVideoSuccess = (state, action) => {
  // let data;
  // if (action.response.data !== undefined) {
  //   let my_experience = [action.response.data, ...state.station_data[0].my_experience];
  //   data = Immutable.merge(state.station_data[0], {
  //     my_experience,
  //   });
  // } else {
  //   data = state.station_data[0];
  // }
  return Immutable.merge(state, {
    // station_data: [data],
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const uploadStationImage = (state, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const uploadStationImageFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const uploadStationImageSuccess = (state, action) => {
  // let data;
  // if (action.response.data !== undefined) {
  //   let my_experience = [action.response.data, ...state.station_data[0].my_experience];
  //   data = Immutable.merge(state.station_data[0], {
  //     my_experience,
  //   });
  // } else {
  //   data = state.station_data[0];
  // }
  return Immutable.merge(state, {
    // station_data: [data],
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const joinStation = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setDefaultStationMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setStationLoad = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    isStationLoad: action.stationLoad,
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

export const setActiveStation = (state, action) => {
  return Immutable.merge(state, {
    activeStation: action.activeStation,
  });
};

export const setLocalStation = (state, action) => {
  return Immutable.merge(state, {
    localStation: action.localStation,
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_STATION]: addStation,
  [Types.ADD_STATION_SUCCESS]: addStationSuccess,
  [Types.ADD_STATION_FAILURE]: addStationFailure,

  [Types.UPDATE_STATION]: updateStation,
  [Types.UPDATE_STATION_SUCCESS]: updateStationSuccess,
  [Types.UPDATE_STATION_FAILURE]: updateStationFailure,

  [Types.GET_STATION]: getStation,
  [Types.GET_STATION_SUCCESS]: getStationSuccess,
  [Types.GET_STATION_FAILURE]: getStationFailure,

  [Types.LEAVE_STATION]: leaveStation,
  [Types.LEAVE_STATION_SUCCESS]: leaveStationSuccess,
  [Types.LEAVE_STATION_FAILURE]: leaveStationFailure,

  [Types.DELETE_STATION]: deleteStation,
  [Types.DELETE_STATION_SUCCESS]: deleteStationSuccess,
  [Types.DELETE_STATION_FAILURE]: deleteStationFailure,

  [Types.END_STATION]: endStation,

  [Types.LIKE_STATION]: likeStation,
  [Types.LIKE_STATION_SUCCESS]: likeStationSuccess,
  [Types.LIKE_STATION_FAILURE]: likeStationFailure,

  [Types.ADD_STATION_COMMENT]: addStationComment,
  [Types.ADD_STATION_COMMENT_SUCCESS]: addStationCommentSuccess,
  [Types.ADD_STATION_COMMENT_FAILURE]: addStationCommentFailure,

  [Types.DELETE_STATION_MEDIA]: deleteStationMedia,
  [Types.DELETE_STATION_MEDIA_SUCCESS]: deleteStationMediaSuccess,
  [Types.DELETE_STATION_MEDIA_FAILURE]: deleteStationMediaFailure,

  [Types.EDIT_STATION_MEDIA]: editStationMedia,
  [Types.EDIT_STATION_MEDIA_SUCCESS]: editStationMediaSuccess,
  [Types.EDIT_STATION_MEDIA_FAILURE]: editStationMediaFailure,

  [Types.UPLOAD_STATION_VIDEO]: uploadStationVideo,
  [Types.UPLOAD_STATION_VIDEO_SUCCESS]: uploadStationVideoSuccess,
  [Types.UPLOAD_STATION_VIDEO_FAILURE]: uploadStationVideoFailure,

  [Types.UPLOAD_STATION_IMAGE]: uploadStationImage,
  [Types.UPLOAD_STATION_IMAGE_SUCCESS]: uploadStationImageSuccess,
  [Types.UPLOAD_STATION_IMAGE_FAILURE]: uploadStationImageFailure,

  [Types.JOIN_STATION]: joinStation,

  [Types.SET_DEFAULT_STATION_MEDIA]: setDefaultStationMedia,

  [Types.SET_STATION_LOAD]: setStationLoad,
  [Types.SET_GEOFENCE]: setGeofence,

  [Types.SET_ACTIVE_STATION]: setActiveStation,
  [Types.SET_LOCAL_STATION]: setLocalStation,
});
