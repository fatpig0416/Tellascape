import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../../initialState';
import { static as Immutable } from 'seamless-immutable';
import { IMAGE_FILTERS } from '../../../../utils';
import { createSelector } from 'reselect';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    // Get Categories
    getCategoryLists: ['data'],
    getCategoryListsSuccess: ['response'],
    getCategoryListsFailure: ['error'],

    // Add Event
    addEvent: ['data'],
    addEventSuccess: ['response'],
    addEventFailure: ['response'],

    // Update Event
    updateEvent: ['data'],
    updateEventSuccess: ['response'],
    updateEventFailure: ['error'],

    // Update Quick Event
    updateQuickEvent: ['data'],
    updateQuickEventSuccess: ['response'],
    updateQuickEventFailure: ['error'],

    // Leave Event
    leaveEvent: ['data'],
    leaveEventSuccess: ['response'],
    leaveEventFailure: ['error'],

    // Delete Event
    deleteEvent: ['data'],
    deleteEventSuccess: ['response'],
    deleteEventFailure: ['error'],

    // Attendence
    attendance: ['data'],
    attendanceSuccess: ['response'],
    attendanceFailure: ['error'],

    // Guest Lists
    getGuestLists: ['data'],
    getGuestListsSuccess: ['response'],
    getGuestListsFailure: ['error'],

    // Get Event
    getEvent: ['data'],
    getEventSuccess: ['response'],
    getEventFailure: ['error'],

    // Set Default Media
    setDefaultMedia: ['data'],
    setDefaultMediaSuccess: ['response'],
    setDefaultMediaFailure: ['error'],

    // Edit Media
    editMedia: ['data'],
    editMediaSuccess: ['response'],
    editMediaFailure: ['error'],

    // Delete Media
    deleteMedia: ['data'],
    deleteMediaSuccess: ['response'],
    deleteMediaFailure: ['error'],

    // Add Comment Media
    addPostEventComment: ['data'],
    addPostEventCommentSuccess: ['response'],
    addPostEventCommentFailure: ['error'],

    // Get Post Event
    getPostEvent: ['data'],
    getPostEventSuccess: ['response'],
    getPostEventFailure: ['error'],

    // Add Invite
    addInvite: ['data'],
    addInviteSuccess: ['response'],
    addInviteFailure: ['error'],

    // Delete Invited Guest
    deleteInvite: ['data'],
    deleteInviteSuccess: ['response'],
    deleteInviteFailure: ['error'],

    // Block User
    blockUser: ['data'],
    blockUserSuccess: ['response'],
    blockUserFailure: ['error'],

    // Set Geofence
    setGeofence: ['geofence'],

    // Set JoinEvent Data
    setJoinEventData: ['joinevent'],

    // Active Experience
    setActiveExperience: ['activeExperience'],

    // Join Event close
    setJoinEventClose: ['joinEventClose'],

    // Event Load
    setEventLoad: ['eventLoad'],

    // Local Experience
    setLocalExperience: ['localExperience'],

    // Profile Load
    setProfileLoad: ['profileLoad'],

    // Upload Media
    uploadImage: ['data'],
    uploadImageSuccess: ['response'],
    uploadImageFailure: ['error'],
    uploadImageReset: [],
    uploadVideo: ['data'],
    uploadVideoSuccess: ['response'],
    uploadVideoFailure: ['error'],

    // Report Event
    reportEvent: ['data'],
    reportEventSuccess: ['response'],
    reportEventFailure: ['error'],

    // Store Current LiveEvent Data
    storeSelectedLiveEventData: ['selectedLiveEventData'],

    // Fetch Trending Media
    fetchTrendingMedia: ['data'],
    fetchTrendingMediaSuccess: ['response'],
    fetchTrendingMediaFailure: ['error'],

    //Set LiveEvent Image URI
    setLiveEventImage: ['data'],
    updateCurrentImageFilter: ['data'],

    // Add Event comment

    addEventComment: ['data'],
    addEventCommentSuccess: ['response'],
    addEventCommentFailure: ['error'],

    // Add Event comment
    getEventComments: ['data'],
    getEventCommentsSuccess: ['response'],
    getEventCommentsFailure: ['error'],

    // Like Event
    likeEvent: ['data'],
    likeEventSuccess: ['response'],
    likeEventFailure: ['error'],

    // Unlike Event
    unlikeEvent: ['data'],
    unlikeEventSuccess: ['response'],
    unlikeEventFailure: ['error'],

    // User/Profile event data
    getProfileData: ['data'],
    getProfileDataSuccess: ['response'],
    getProfileDataFailure: ['error'],
    setPusherProfileData: ['data'],

    // Update Profile
    profileUpdate: ['data'],
    profileUpdateSuccess: ['response'],
    profileUpdateFailure: ['error'],

    // Profile Journey
    profileJourney: ['data'],
    profileJourneySuccess: ['response'],
    profileJourneyFailure: ['error'],

    // follow user
    followUser: ['data'],
    followUserSuccess: ['response'],
    followUserFailure: ['error'],

    // Set Profile Settings
    setProfileSettings: ['data'],
    setProfileSettingsSuccess: ['response'],
    setProfileSettingsFailure: ['error'],

    // Block Profile
    blockProfile: ['data'],
    blockProfileSuccess: ['response'],
    blockProfileFailure: ['error'],

    // Get Other User Media
    getOtherUserMedia: ['data'],
    getOtherUserMediaSuccess: ['response'],
    getOtherUserMediaFailure: ['error'],

    // Update Ghost Mode
    updateGhostMode: ['data'],
    updateGhostSuccess: ['response'],
    updateGhostFailure: ['error'],

    // Assign Admin
    assignAdmin: ['data'],
    assignAdminSuccess: ['response'],
    assignAdminFailure: ['error'],
    updateGuestAdmin: ['data'],

    verifyPin: ['data'],

    removeEvent: ['data'],

    setPrivateJoinedEvent: ['data'],

    shareUrl: ['data'],
    shareUrlSuccess: ['response'],
    shareUrlFailure: ['error'],

    deleteComment: ['data'],
    deleteCommentSuccess: ['response'],
    deleteCommentFailure: ['error'],
  },
  {}
);

export const ExperienceActions = Types;
export default Creators;

/* ------------- Reducers ------------- */
export const getCategoryLists = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getCategoryListsFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getCategoryListsSuccess = (state, action) => {
  return Immutable.merge(state, {
    categoryLists: action.response.data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Create Event */
export const addEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addEventFailure = (state, action) => {
  action.response.addEventFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addEventSuccess = (state, action) => {
  action.response.payload.addEventSuccess(action.response.response);
  return Immutable.merge(state, {
    data: Immutable(state.data).concat(action.response.response),
    current: action.response.response,
    loading: true,
  });
};

/* Update Event */
export const updateEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const updateEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const updateEventSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents).concat(action.response),
  });
};

/* Update Quick Event */
export const updateQuickEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const updateQuickEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const updateQuickEventSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents).concat(action.response),
  });
};

/* Attendance */
export const attendance = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const attendanceFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const attendanceSuccess = (state, action) => {
  return Immutable.merge(state, {
    attendanceData: action.response,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Get Event */
export const getEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getEventSuccess = (state, action) => {
  return Immutable.merge(state, {
    data: Immutable(state.data).concat(action.response),
    current: action.response,
  });
};

/* Get Post Event */
export const getPostEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getPostEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getPostEventSuccess = (state, action) => {
  return Immutable.merge(state, {
    isPostEventRefresh: false,
    current: action.response,
    event_data: Immutable(action.response),
    loading: false,
    isEventLoad: true,
  });
};

/* Set Default Media */
export const setDefaultMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setDefaultMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
    isPostEventRefresh: false,
  });
};
export const setDefaultMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    // data: Immutable(action.response),
    // isPostEventRefresh: true,
    // current: action.response,
    fetching: false,
  });
};

/* Edit Media */
export const editMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const editMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const editMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    //data: Immutable(action.response),
    // isPostEventRefresh: true,
    //current: action.response,
  });
};

/* Delete Media */
export const deleteMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const deleteMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    // data: Immutable(action.response),
    // isPostEventRefresh: true,
    // current: action.response,
  });
};
// Add Post Comment

export const addPostEventComment = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addPostEventCommentFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addPostEventCommentSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
  });
};

/* Get Guest Lists */
export const getGuestLists = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getGuestListsFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getGuestListsSuccess = (state, action) => {
  return Immutable.merge(state, {
    guestLists: action.response.data,
    error: false,
    errorMessage: '',
    fetching: false,
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

export const setJoinEventData = (state, action) => {
  return Immutable.merge(state, {
    joinEventData: action.joinevent,
  });
};

export const setActiveExperience = (state, action) => {
  return Immutable.merge(state, {
    activeExperience: action.activeExperience,
  });
};

export const setJoinEventClose = (state, action) => {
  return Immutable.merge(state, {
    joinEventClose: action.joinEventClose,
  });
};

export const setEventLoad = (state, action) => {
  return Immutable.merge(state, {
    isEventLoad: action.eventLoad,
  });
};

export const setLocalExperience = (state, action) => {
  return Immutable.merge(state, {
    localExperience: action.localExperience,
  });
};

export const setProfileLoad = (state, action) => {
  return Immutable.merge(state, {
    isProfileLoad: action.profileLoad,
  });
};

/* Leave Event */
export const leaveEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const leaveEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const leaveEventSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

/* Delete Event */
export const deleteEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const deleteEventSuccess = (state, action) => {
  const filterEvents = state.data.filter(item => item.parentID !== action.response.parentID);
  return Immutable.merge(state, {
    data: Immutable(filterEvents),
  });
};

/* Add Invite */
export const addInvite = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addInviteFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addInviteSuccess = (state, action) => {
  let data;
  if (action.response.data && action.response.data !== null && action.response.data.invited_guest) {
    let newArray = [...state.guestLists.guest_lists];
    let index = newArray.findIndex(item => item.userID === action.response.data.invited_guest.userID);
    if (index !== -1) {
      newArray[index] = {
        ...newArray[index],
        status: action.response.data.invited_guest.status,
      };
    }
    let invited_user = [...state.guestLists.invited_user, ...[action.response.data.invited_guest]];
    let guest_lists = [...newArray];
    data = Immutable.merge(state.guestLists, {
      guest_lists,
      invited_user,
    });
  } else {
    data = state.guestLists;
  }
  return Immutable.merge(state, {
    guestLists: data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Delete Invite */
export const deleteInvite = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteInviteFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const deleteInviteSuccess = (state, action) => {
  let data;
  if (action.response && action.response.removed_guest_id) {
    let newArray = [...state.guestLists.invited_user];
    let index = newArray.findIndex(item => item.userID === action.response.removed_guest_id);
    if (index !== -1) {
      newArray.splice(index, 1);
    }
    data = Immutable.merge(state.guestLists, {
      invited_user: newArray,
    });
  } else {
    data = state.guestLists;
  }
  return Immutable.merge(state, {
    guestLists: data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Block User */
export const blockUser = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const blockUserFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const blockUserSuccess = (state, action) => {
  let data;
  if (action.response.data && action.response.data.userID) {
    let newArray = [...state.guestLists.invited_user];
    let index = newArray.findIndex(item => item.userID === action.response.data.userID);
    if (index !== -1) {
      newArray[index] = {
        ...newArray[index],
        is_blocked: action.response.is_blocked,
      };
    }
    data = Immutable.merge(state.guestLists, {
      invited_user: newArray,
    });
  } else {
    data = state.guestLists;
  }

  return Immutable.merge(state, {
    guestLists: data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Report Event */
export const reportEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const reportEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const reportEventSuccess = (state, action) => {
  return Immutable.merge(state, {
    data: Immutable(state.data),
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/** Upload Media */
export const uploadImage = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    fetching: true,
    uploadSuccessful: false,
  });
};

export const uploadImageFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
    uploadSuccessful: false,
  });
};

export const uploadImageSuccess = (state, action) => {
  // let data;
  // if (action.response.data !== undefined) {
  //   let my_experience = [action.response.data, ...state.event_data[0].my_experience];
  //   data = Immutable.merge(state.event_data[0], {
  //     my_experience,
  //   });
  // } else {
  //   data = state.event_data[0];
  // }
  return Immutable.merge(state, {
    // event_data: [data],
    error: false,
    errorMessage: '',
    fetching: false,
    uploadSuccessful: true,
  });
};

export const uploadImageReset = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: null,
    uploadSuccessful: false,
  });
};

export const uploadVideo = (state, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const uploadVideoFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const uploadVideoSuccess = (state, action) => {
  // let data;
  // if (action.response.data !== undefined) {
  //   let my_experience = [action.response.data, ...state.event_data[0].my_experience];
  //   data = Immutable.merge(state.event_data[0], {
  //     my_experience,
  //   });
  // } else {
  //   data = state.event_data[0];
  // }
  return Immutable.merge(state, {
    // event_data: [data],
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const storeSelectedLiveEventData = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    selectedLiveEventData: Immutable(action.selectedLiveEventData),
  });
};

export const fetchTrendingMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const fetchTrendingMediaSuccess = (state = INITIAL_STATE, action) => {
  const carouselEntries = action.response.data.my_uploads.map(item => ({
    userID: item.userId,
    mediaID: item.mediaId,
    likes: item.likes,
    msgCounts: item.comments,
    illustration: item.url,
    createAt: item.create_at,
    coordinate: {
      latitude: Number(item.lat),
      longitude: Number(item.lng),
    },
  }));
  return Immutable.merge(state, {
    carouselEntries: carouselEntries,
    viewMedia: action.response.data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const fetchTrendingMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/* Add Event Comment */

export const addEventComment = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const addEventCommentFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const addEventCommentSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Get Event Comments */
export const getEventComments = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getEventCommentsFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getEventCommentsSuccess = (state, action) => {
  return Immutable.merge(state, {
    comments: action.response.data,
    likes: action.response.likes,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Like Event Media */
export const likeEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const likeEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const likeEventSuccess = (state, action) => {
  return Immutable.merge(state, {
    likes: action.response.likes,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Unlike Event Media */
export const unlikeEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const unlikeEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const unlikeEventSuccess = (state, action) => {
  return Immutable.merge(state, {
    data: Immutable(state.data),
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* get Profile Event */
export const getProfileData = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getProfileDataFailure = (state, action) => {
  if (action.error.profileDataFailure) action.error.profileDataFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getProfileDataSuccess = (state, action) => {
  if (action.response.payload.profileDataSuccess) action.response.payload.profileDataSuccess(action.response.response);
  let data;
  if (action.response.empty) {
    data = [...action.response.response.data];
  } else {
    data = [...state.profileData.data, ...action.response.response.data];
  }
  let userData = {
    ...action.response.response,
    data,
  };
  return Immutable.merge(state, {
    profileData: userData,
    error: false,
    errorMessage: '',
    fetching: false,
    isProfileLoad: true,
  });
};

export const setPusherProfileData = (state, action) => {
  return Immutable.merge(state, {
    profileData: action.data,
  });
};

/* Profile Update */
export const profileUpdate = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const profileUpdateFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const profileUpdateSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Profile Journey */
export const profileJourney = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const profileJourneyFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const profileJourneySuccess = (state, action) => {
  return Immutable.merge(state, {
    journeyData: action.response,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* follow User */
export const followUser = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const followUserFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const followUserSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Profile Settings */
export const setProfileSettings = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setProfileSettingsFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const setProfileSettingsSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Block Profile */
export const blockProfile = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const blockProfileFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const blockProfileSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Other User Media */

export const getOtherUserMedia = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getOtherUserMediaFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};
export const getOtherUserMediaSuccess = (state, action) => {
  return Immutable.merge(state, {
    other_user_media: Immutable(action.response),
  });
};

export const verifyPin = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const removeEvent = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const setLiveEventImage = (state, action) => {
  return Immutable.merge(state, {
    liveEventImage: action.data,
    currentImageFilter: 'Normal', //default filter is Normal
    imageFilters: IMAGE_FILTERS,
  });
};

export const updateCurrentImageFilter = (state, action) => {
  return Immutable.merge(state, {
    currentImageFilter: action.data,
  });
};

/* Update Ghost Mode */
export const updateGhostMode = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const updateGhostFailure = (state, action) => {
  return Immutable.merge(state, {
    error: true,
    fetching: false,
    errorMessage: action.error,
  });
};

export const updateGhostSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    fetching: false,
    errorMessage: '',
  });
};

/* Assign Admin */
export const assignAdmin = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const assignAdminFailure = (state, action) => {
  return Immutable.merge(state, {
    error: true,
    fetching: false,
    errorMessage: action.error,
  });
};

export const assignAdminSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    fetching: false,
    errorMessage: '',
  });
};

export const updateGuestAdmin = (state, action) => {
  let data = {
    ...state.event_data[0],
    guest_admin: action.data,
  };
  return Immutable.merge(state, {
    event_data: [data],
    error: false,
    fetching: false,
    errorMessage: '',
  });
};

export const setPrivateJoinedEvent = (state, action) => {
  return Immutable.merge(state, {
    privateJoinedEvents: action.data,
  });
};

/** Share Url */
export const shareUrl = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const shareUrlFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const shareUrlSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/** Delete Comment */
export const deleteComment = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const deleteCommentFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const deleteCommentSuccess = (state, action) => {
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CATEGORY_LISTS]: getCategoryLists,
  [Types.GET_CATEGORY_LISTS_SUCCESS]: getCategoryListsSuccess,
  [Types.GET_CATEGORY_LISTS_FAILURE]: getCategoryListsFailure,
  [Types.ADD_EVENT]: addEvent,
  [Types.ADD_EVENT_SUCCESS]: addEventSuccess,
  [Types.ADD_EVENT_FAILURE]: addEventFailure,
  [Types.DELETE_INVITE]: deleteInvite,
  [Types.DELETE_INVITE_SUCCESS]: deleteInviteSuccess,
  [Types.DELETE_INVITE_FAILURE]: deleteInviteFailure,
  [Types.UPDATE_EVENT]: updateEvent,
  [Types.UPDATE_EVENT_SUCCESS]: updateEventSuccess,
  [Types.UPDATE_EVENT_FAILURE]: updateEventFailure,
  [Types.UPDATE_QUICK_EVENT]: updateQuickEvent,
  [Types.UPDATE_QUICK_EVENT_SUCCESS]: updateQuickEventSuccess,
  [Types.UPDATE_QUICK_EVENT_FAILURE]: updateQuickEventFailure,
  [Types.ATTENDANCE]: attendance,
  [Types.ATTENDANCE_SUCCESS]: attendanceSuccess,
  [Types.ATTENDANCE_FAILURE]: attendanceFailure,
  [Types.GET_GUEST_LISTS]: getGuestLists,
  [Types.GET_GUEST_LISTS_SUCCESS]: getGuestListsSuccess,
  [Types.GET_GUEST_LISTS_FAILURE]: getGuestListsFailure,
  [Types.GET_EVENT]: getEvent,
  [Types.GET_EVENT_SUCCESS]: getEventSuccess,
  [Types.GET_EVENT_FAILURE]: getEventFailure,

  [Types.GET_POST_EVENT]: getPostEvent,
  [Types.GET_POST_EVENT_SUCCESS]: getPostEventSuccess,
  [Types.GET_POST_EVENT_FAILURE]: getPostEventFailure,

  [Types.SET_DEFAULT_MEDIA]: setDefaultMedia,
  [Types.SET_DEFAULT_MEDIA_SUCCESS]: setDefaultMediaSuccess,
  [Types.SET_DEFAULT_MEDIA_FAILURE]: setDefaultMediaFailure,

  [Types.EDIT_MEDIA]: editMedia,
  [Types.EDIT_MEDIA_SUCCESS]: editMediaSuccess,
  [Types.EDIT_MEDIA_FAILURE]: editMediaFailure,

  [Types.DELETE_MEDIA]: deleteMedia,
  [Types.DELETE_MEDIA_SUCCESS]: deleteMediaSuccess,
  [Types.DELETE_MEDIA_FAILURE]: deleteMediaFailure,

  [Types.ADD_POST_EVENT_COMMENT]: addPostEventComment,
  [Types.ADD_POST_EVENT_COMMENT_SUCCESS]: addPostEventCommentSuccess,
  [Types.ADD_POST_EVENT_COMMENT_FAILURE]: addPostEventCommentFailure,

  [Types.SET_GEOFENCE]: setGeofence,
  [Types.SET_JOIN_EVENT_DATA]: setJoinEventData,
  [Types.SET_ACTIVE_EXPERIENCE]: setActiveExperience,
  [Types.SET_JOIN_EVENT_CLOSE]: setJoinEventClose,
  [Types.SET_EVENT_LOAD]: setEventLoad,
  [Types.SET_LOCAL_EXPERIENCE]: setLocalExperience,
  [Types.SET_PROFILE_LOAD]: setProfileLoad,
  [Types.LEAVE_EVENT]: leaveEvent,
  [Types.LEAVE_EVENT_SUCCESS]: leaveEventSuccess,
  [Types.LEAVE_EVENT_FAILURE]: leaveEventFailure,
  [Types.DELETE_EVENT]: deleteEvent,
  [Types.DELETE_EVENT_SUCCESS]: deleteEventSuccess,
  [Types.DELETE_EVENT_FAILURE]: deleteEventFailure,
  [Types.ADD_INVITE]: addInvite,
  [Types.ADD_INVITE_SUCCESS]: addInviteSuccess,
  [Types.ADD_INVITE_FAILURE]: addInviteFailure,
  [Types.BLOCK_USER]: blockUser,
  [Types.BLOCK_USER_SUCCESS]: blockUserSuccess,
  [Types.BLOCK_USER_FAILURE]: blockUserFailure,
  [Types.UPLOAD_IMAGE]: uploadImage,
  [Types.UPLOAD_IMAGE_SUCCESS]: uploadImageSuccess,
  [Types.UPLOAD_IMAGE_FAILURE]: uploadImageFailure,
  [Types.UPLOAD_IMAGE_RESET]: uploadImageReset,
  [Types.UPLOAD_VIDEO]: uploadVideo,
  [Types.UPLOAD_VIDEO_SUCCESS]: uploadVideoSuccess,
  [Types.UPLOAD_VIDEO_FAILURE]: uploadVideoFailure,
  [Types.REPORT_EVENT]: reportEvent,
  [Types.REPORT_EVENT_SUCCESS]: reportEventSuccess,
  [Types.REPORT_EVENT_FAILURE]: reportEventFailure,
  [Types.STORE_SELECTED_LIVE_EVENT_DATA]: storeSelectedLiveEventData,
  [Types.FETCH_TRENDING_MEDIA]: fetchTrendingMedia,
  [Types.FETCH_TRENDING_MEDIA_SUCCESS]: fetchTrendingMediaSuccess,
  [Types.FETCH_TRENDING_MEDIA_FAILURE]: fetchTrendingMediaFailure,
  [Types.SET_LIVE_EVENT_IMAGE]: setLiveEventImage,
  [Types.UPDATE_CURRENT_IMAGE_FILTER]: updateCurrentImageFilter,
  [Types.ADD_EVENT_COMMENT]: addEventComment,
  [Types.ADD_EVENT_COMMENT_SUCCESS]: addEventCommentSuccess,
  [Types.ADD_EVENT_COMMENT_FAILURE]: addEventCommentFailure,
  [Types.GET_EVENT_COMMENTS]: getEventComments,
  [Types.GET_EVENT_COMMENTS_SUCCESS]: getEventCommentsSuccess,
  [Types.GET_EVENT_COMMENTS_FAILURE]: getEventCommentsFailure,
  [Types.LIKE_EVENT]: likeEvent,
  [Types.LIKE_EVENT_SUCCESS]: likeEventSuccess,
  [Types.LIKE_EVENT_FAILURE]: likeEventFailure,
  [Types.UNLIKE_EVENT]: unlikeEvent,
  [Types.UNLIKE_EVENT_SUCCESS]: unlikeEventSuccess,
  [Types.UNLIKE_EVENT_FAILURE]: unlikeEventFailure,
  [Types.GET_PROFILE_DATA]: getProfileData,
  [Types.GET_PROFILE_DATA_SUCCESS]: getProfileDataSuccess,
  [Types.GET_PROFILE_DATA_FAILURE]: getProfileDataFailure,
  [Types.SET_PUSHER_PROFILE_DATA]: setPusherProfileData,
  [Types.PROFILE_UPDATE]: profileUpdate,
  [Types.PROFILE_UPDATE_SUCCESS]: profileUpdateSuccess,
  [Types.PROFILE_UPDATE_FAILURE]: profileUpdateFailure,
  [Types.FOLLOW_USER]: followUser,
  [Types.FOLLOW_USER_SUCCESS]: followUserSuccess,
  [Types.FOLLOW_USER_FAILURE]: followUserFailure,
  [Types.SET_PROFILE_SETTINGS]: setProfileSettings,
  [Types.SET_PROFILE_SETTINGS_SUCCESS]: setProfileSettingsSuccess,
  [Types.SET_PROFILE_SETTINGS_FAILURE]: setProfileSettingsFailure,
  [Types.BLOCK_PROFILE]: blockProfile,
  [Types.BLOCK_PROFILE_SUCCESS]: blockProfileSuccess,
  [Types.BLOCK_PROFILE_FAILURE]: blockProfileFailure,
  [Types.GET_OTHER_USER_MEDIA]: getOtherUserMedia,
  [Types.GET_OTHER_USER_MEDIA_SUCCESS]: getOtherUserMediaSuccess,
  [Types.GET_OTHER_USER_MEDIA_FAILURE]: getOtherUserMediaFailure,
  [Types.VERIFY_PIN]: verifyPin,
  [Types.REMOVE_EVENT]: removeEvent,
  [Types.UPDATE_GHOST_MODE]: updateGhostMode,
  [Types.UPDATE_GHOST_SUCCESS]: updateGhostSuccess,
  [Types.UPDATE_GHOST_FAILURE]: updateGhostFailure,
  [Types.ASSIGN_ADMIN]: assignAdmin,
  [Types.ASSIGN_ADMIN_SUCCESS]: assignAdminSuccess,
  [Types.ASSIGN_ADMIN_FAILURE]: assignAdminFailure,
  [Types.UPDATE_GUEST_ADMIN]: updateGuestAdmin,
  [Types.SET_PRIVATE_JOINED_EVENT]: setPrivateJoinedEvent,
  [Types.PROFILE_JOURNEY]: profileJourney,
  [Types.PROFILE_JOURNEY_SUCCESS]: profileJourneySuccess,
  [Types.PROFILE_JOURNEY_FAILURE]: profileJourneyFailure,

  [Types.SHARE_URL]: shareUrl,
  [Types.SHARE_URL_SUCCESS]: shareUrlSuccess,
  [Types.SHARE_URL_FAILURE]: shareUrlFailure,

  [Types.DELETE_COMMENT]: deleteComment,
  [Types.DELETE_COMMENT_SUCCESS]: deleteCommentSuccess,
  [Types.DELETE_COMMENT_FAILURE]: deleteCommentFailure,
});

const selectExperience = state => state.experience;

export const selectGeofence = createSelector(
  [selectExperience],
  experience => experience.geofence
);

export const selectData = createSelector(
  [selectExperience],
  experience => experience.data
);

export const selectLoading = createSelector(
  [selectExperience],
  experience => experience.loading
);

export const selectPostEventData = createSelector(
  [selectExperience],
  experience => experience.event_data
);

export const selectCurrent = createSelector(
  [selectExperience],
  experience => experience.current
);

export const selectEventData = createSelector(
  [selectExperience],
  experience => experience.event_data
);

export const selectOtherUserMediaData = createSelector(
  [selectExperience],
  experience => experience.other_user_media
);

export const selectGuestListData = createSelector(
  [selectExperience],
  experience => experience.guestLists
);

export const selectedLiveEventData = createSelector(
  [selectExperience],
  experience => experience.selectedLiveEventData
);

export const selectCategoryLists = createSelector(
  [selectExperience],
  experience => experience.categoryLists
);

export const selectProfile = createSelector(
  [selectExperience],
  experience => experience.profileData
);
