import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../../memoryInitialState';
import { static as Immutable } from 'seamless-immutable';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    // Add Memory
    addMemory: ['data'],
    addMemorySuccess: ['response'],
    addMemoryFailure: ['response'],

    // Update Memory
    updateMemory: ['data'],
    updateMemorySuccess: ['response'],
    updateMemoryFailure: ['error'],

    // Start Memory
    startMemory: ['data'],
    startMemorySuccess: ['response'],
    startMemoryFailure: ['error'],

    // Leave Memory
    leaveMemory: ['data'],
    leaveMemorySuccess: ['response'],
    leaveMemoryFailure: ['error'],

    // Delete Memory
    deleteMemory: ['data'],
    deleteMemorySuccess: ['response'],
    deleteMemoryFailure: ['error'],

    // End Memory
    endMemory: ['data'],

    // Get Memory
    getMemory: ['data'],
    getMemorySuccess: ['response'],
    getMemoryFailure: ['error'],

    // Like Memory
    likeMemory: ['data'],
    likeMemorySuccess: ['response'],
    likeMemoryFailure: ['error'],

    // Add Comment Media
    addMemoryComment: ['data'],
    addMemoryCommentSuccess: ['response'],
    addMemoryCommentFailure: ['error'],

    // Delete Memory
    deleteMemoryMedia: ['data'],
    deleteMemoryMediaSuccess: ['response'],
    deleteMemoryMediaFailure: ['error'],

    // Edit Media
    editMemoryMedia: ['data'],
    editMemoryMediaSuccess: ['response'],
    editMemoryMediaFailure: ['error'],

    // Upload Video
    uploadMemoryVideo: ['data'],
    uploadMemoryVideoSuccess: ['response'],
    uploadMemoryVideoFailure: ['error'],

    // Upload Image
    uploadMemoryImage: ['data'],
    uploadMemoryImageSuccess: ['response'],
    uploadMemoryImageFailure: ['error'],

    joinMemory: ['data'],

    // Set Default Media
    setDefaultMemoryMedia: ['data'],

    // Set Geofence
    setGeofence: ['geofence'],

    // Memory Load
    setMemoryLoad: ['memoryLoad'],

    // Active Experience
    setActiveMemory: ['activeMemory'],

    // Local Memory
    setLocalMemory: ['localMemory'],

    // Local Memory
    setStartQuickMemory: ['status'],
  },
  {}
);

export const MemoryActions = Types;
export default Creators;

/* ------------- Reducers ------------- */

/* Create Memory */
export const addMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addMemoryFailure = (state, action) => {
  action.response.addMemoryFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addMemorySuccess = (state, action) => {
  action.response.payload.addMemorySuccess(action.response.response);
  return Immutable.set(state, {
    fetching: false,
    error: false,
  });
};

/* Start Memory */
export const startMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const startMemoryFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const startMemorySuccess = (state, action) => {
  return Immutable.set(state, {
    fetching: false,
    error: false,
  });
};

/* Update Memory */
export const updateMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const updateMemoryFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const updateMemorySuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
  });
};

/* Get Memory */
export const getMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getMemoryFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getMemorySuccess = (state, action) => {
  return Immutable.merge(state, {
    memory_data: action.response,
    isMemoryLoad: true,
  });
};

/* Leave Memory */
export const leaveMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const leaveMemoryFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const leaveMemorySuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

/* Delete Memory */
export const deleteMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteMemoryFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const deleteMemorySuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

/* End Memory */
export const endMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

/* Like Memory Media */
export const likeMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const likeMemoryFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const likeMemorySuccess = (state, action) => {
  return Immutable.merge(state, {
    likes: action.response.likes,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

// Add Post Comment

export const addMemoryComment = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addMemoryCommentFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addMemoryCommentSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

/* Delete Media */
export const deleteMemoryMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteMemoryMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const deleteMemoryMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

/* Edit Media */
export const editMemoryMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const editMemoryMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const editMemoryMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

export const uploadMemoryVideo = (state, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const uploadMemoryVideoFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const uploadMemoryVideoSuccess = (state, action) => {
  // let data;
  // if (action.response.data !== undefined) {
  //   let my_experience = [action.response.data, ...state.memory_data[0].my_experience];
  //   data = Immutable.merge(state.memory_data[0], {
  //     my_experience,
  //   });
  // } else {
  //   data = state.memory_data[0];
  // }
  return Immutable.merge(state, {
    // memory_data: [data],
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const uploadMemoryImage = (state, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const uploadMemoryImageFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const uploadMemoryImageSuccess = (state, action) => {
  // let data;
  // if (action.response.data !== undefined) {
  //   let my_experience = [action.response.data, ...state.memory_data[0].my_experience];
  //   data = Immutable.merge(state.memory_data[0], {
  //     my_experience,
  //   });
  // } else {
  //   data = state.memory_data[0];
  // }
  return Immutable.merge(state, {
    // memory_data: [data],
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const joinMemory = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setDefaultMemoryMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setMemoryLoad = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    isMemoryLoad: action.memoryLoad,
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

export const setActiveMemory = (state, action) => {
  return Immutable.merge(state, {
    activeMemory: action.activeMemory,
  });
};

export const setLocalMemory = (state, action) => {
  return Immutable.merge(state, {
    localMemory: action.localMemory,
  });
};
export const setStartQuickMemory = (state, action) => {
  return Immutable.merge(state, {
    isQuickMemoryStarted: action.status,
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_MEMORY]: addMemory,
  [Types.ADD_MEMORY_SUCCESS]: addMemorySuccess,
  [Types.ADD_MEMORY_FAILURE]: addMemoryFailure,

  [Types.UPDATE_MEMORY]: updateMemory,
  [Types.UPDATE_MEMORY_SUCCESS]: updateMemorySuccess,
  [Types.UPDATE_MEMORY_FAILURE]: updateMemoryFailure,

  [Types.START_MEMORY]: startMemory,
  [Types.START_MEMORY_SUCCESS]: startMemorySuccess,
  [Types.START_MEMORY_FAILURE]: startMemoryFailure,

  [Types.GET_MEMORY]: getMemory,
  [Types.GET_MEMORY_SUCCESS]: getMemorySuccess,
  [Types.GET_MEMORY_FAILURE]: getMemoryFailure,

  [Types.LEAVE_MEMORY]: leaveMemory,
  [Types.LEAVE_MEMORY_SUCCESS]: leaveMemorySuccess,
  [Types.LEAVE_MEMORY_FAILURE]: leaveMemoryFailure,

  [Types.DELETE_MEMORY]: deleteMemory,
  [Types.DELETE_MEMORY_SUCCESS]: deleteMemorySuccess,
  [Types.DELETE_MEMORY_FAILURE]: deleteMemoryFailure,

  [Types.END_MEMORY]: endMemory,

  [Types.LIKE_MEMORY]: likeMemory,
  [Types.LIKE_MEMORY_SUCCESS]: likeMemorySuccess,
  [Types.LIKE_MEMORY_FAILURE]: likeMemoryFailure,

  [Types.ADD_MEMORY_COMMENT]: addMemoryComment,
  [Types.ADD_MEMORY_COMMENT_SUCCESS]: addMemoryCommentSuccess,
  [Types.ADD_MEMORY_COMMENT_FAILURE]: addMemoryCommentFailure,

  [Types.DELETE_MEMORY_MEDIA]: deleteMemoryMedia,
  [Types.DELETE_MEMORY_MEDIA_SUCCESS]: deleteMemoryMediaSuccess,
  [Types.DELETE_MEMORY_MEDIA_FAILURE]: deleteMemoryMediaFailure,

  [Types.EDIT_MEMORY_MEDIA]: editMemoryMedia,
  [Types.EDIT_MEMORY_MEDIA_SUCCESS]: editMemoryMediaSuccess,
  [Types.EDIT_MEMORY_MEDIA_FAILURE]: editMemoryMediaFailure,

  [Types.UPLOAD_MEMORY_VIDEO]: uploadMemoryVideo,
  [Types.UPLOAD_MEMORY_VIDEO_SUCCESS]: uploadMemoryVideoSuccess,
  [Types.UPLOAD_MEMORY_VIDEO_FAILURE]: uploadMemoryVideoFailure,

  [Types.UPLOAD_MEMORY_IMAGE]: uploadMemoryImage,
  [Types.UPLOAD_MEMORY_IMAGE_SUCCESS]: uploadMemoryImageSuccess,
  [Types.UPLOAD_MEMORY_IMAGE_FAILURE]: uploadMemoryImageFailure,

  [Types.JOIN_MEMORY]: joinMemory,

  [Types.SET_DEFAULT_MEMORY_MEDIA]: setDefaultMemoryMedia,

  [Types.SET_MEMORY_LOAD]: setMemoryLoad,
  [Types.SET_GEOFENCE]: setGeofence,

  [Types.SET_ACTIVE_MEMORY]: setActiveMemory,
  [Types.SET_START_QUICK_MEMORY]: setStartQuickMemory,
  [Types.SET_LOCAL_MEMORY]: setLocalMemory,
});
