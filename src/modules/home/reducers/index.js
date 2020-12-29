import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../initialState';
import { static as Immutable } from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  getTrendingRequest: ['data'],
  getTrendingSuccess: ['response'],
  getTrendingFailure: ['error'],
  getFeedRequest: ['data'],
  getFeedSuccess: ['response'],
  getFeedFailure: ['error'],
  getLocalRequest: ['data'],
  getLocalSuccess: ['response'],
  getLocalFailure: ['error'],
  getMarkersRequest: ['data'],
  getMarkersSuccess: ['response'],
  getMarkersFailure: ['error'],
  getAmazingsRequest: ['data'],
  getAmazingsSuccess: ['response'],
  getAmazingsFailure: ['error'],

  getSelectedPostRequest: ['data'],

  // explore friends
  getFriends: ['data'],
  getFriendsSuccess: ['response'],
  getFriendsFailure: ['error'],

  // bookmark post
  bookmarkPostRequest: ['data'],
  bookmarkPostSuccess: ['response'],
  bookmarkPostFailure: ['error'],

  // join event
  joinEventRequest: ['data'],
  joinEventSuccess: ['response'],
  joinEventFailure: ['error'],

  // Find Friends
  getPeoples: ['data'],
  getPeoplesSuccess: ['response'],
  getPeoplesFailure: ['error'],

  // save joined events
  saveJoinedEvents: ['data'],

  setLocalSendAlert: ['data'],
});

export const ExploreAction = Types;
export default Creators;

/* ------------- Reducers ------------- */
export const getTrendingRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

export const getTrendingSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
    errorMessage: '',
    data: action.response.data,
  });
};

export const getTrendingFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/* Feeds */
export const getFeedRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

export const getFeedSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
    errorMessage: '',
    feed: action.response.empty ? action.response.data : state.feed.concat(action.response.data),
  });
};

export const getFeedFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/* Local */
export const getLocalRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

export const getLocalSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
    errorMessage: '',
    local: action.response.empty ? action.response.data : state.local.concat(action.response.data),
  });
};

export const getLocalFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/* Markers */
export const getMarkersRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

export const getMarkersSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
    errorMessage: '',
    markers: action.response.data,
  });
};

export const getMarkersFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/* Get Amazing things */
export const getAmazingsRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
    amazingRequest: true,
  });
};

export const getAmazingsSuccess = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: false,
    errorMessage: '',
    amazings: action.response.data,
    amazingRequest: false,
  });
};

export const getAmazingsFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
    amazingRequest: false,
  });
};

/* Explore Friends */
export const getFriends = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getFriendsFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getFriendsSuccess = (state, action) => {
  return Immutable.merge(state, {
    friends: action.response.data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/** Find Friends */
export const getPeoples = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getPeoplesFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getPeoplesSuccess = (state, action) => {
  return Immutable.merge(state, {
    peoples: action.response.data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

/* Bookmark */
export const boomarkPostRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

export const boomarkPostSuccess = (state, action) => {
  function toggle(isBookmark) {
    return !isBookmark;
  }
  const data = state.local.map((item, index) => {
    // let mutableObject = Immutable.asMutable(item);
    if (item.postID === action.response.config.data._parts[2][1]) {
      Immutable.update(item, 'isBookmark', toggle);
      // mutableObject.isBookmark = false;
    }
    return item;
  });
  return Immutable.merge(state, {
    local: Immutable(data),
  });
};

export const boomarkPostFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

/** Join event */
export const joinEventRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

export const joinEventSuccess = (state, action) => {
  return Immutable.merge(state, {
    joinedEvent: action.response.data,
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const joinEventFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const saveJoinedEvents = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    joinedEventsList: Immutable(state.joinedEventsList).concat(action.data),
  });
};

export const setLocalSendAlert = (state, action) => {
  return Immutable.merge(state, {
    localSendAlert: action.data,
  });
};

export const getSelectedPostRequest = (state, action) => {
  return Immutable.merge(state, {
    fetching: true,
    error: false,
    errorMessage: '',
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_TRENDING_REQUEST]: getTrendingRequest,
  [Types.GET_TRENDING_SUCCESS]: getTrendingSuccess,
  [Types.GET_TRENDING_FAILURE]: getTrendingFailure,
  [Types.GET_FEED_REQUEST]: getFeedRequest,
  [Types.GET_FEED_SUCCESS]: getFeedSuccess,
  [Types.GET_FEED_FAILURE]: getFeedFailure,
  [Types.GET_LOCAL_REQUEST]: getLocalRequest,
  [Types.GET_LOCAL_SUCCESS]: getLocalSuccess,
  [Types.GET_LOCAL_FAILURE]: getLocalFailure,
  [Types.GET_MARKERS_REQUEST]: getMarkersRequest,
  [Types.GET_MARKERS_SUCCESS]: getMarkersSuccess,
  [Types.GET_MARKERS_FAILURE]: getMarkersFailure,
  [Types.GET_AMAZINGS_REQUEST]: getAmazingsRequest,
  [Types.GET_AMAZINGS_SUCCESS]: getAmazingsSuccess,
  [Types.GET_AMAZINGS_FAILURE]: getAmazingsFailure,
  [Types.GET_FRIENDS]: getFriends,
  [Types.GET_FRIENDS_SUCCESS]: getFriendsSuccess,
  [Types.GET_FRIENDS_FAILURE]: getFriendsFailure,
  [Types.GET_PEOPLES]: getPeoples,
  [Types.GET_PEOPLES_SUCCESS]: getPeoplesSuccess,
  [Types.GET_PEOPLES_FAILURE]: getPeoplesFailure,
  [Types.BOOKMARK_POST_REQUEST]: boomarkPostRequest,
  [Types.BOOKMARK_POST_SUCCESS]: boomarkPostSuccess,
  [Types.BOOKMARK_POST_FAILURE]: boomarkPostFailure,
  [Types.JOIN_EVENT_REQUEST]: joinEventRequest,
  [Types.JOIN_EVENT_SUCCESS]: joinEventSuccess,
  [Types.JOIN_EVENT_FAILURE]: joinEventFailure,
  [Types.SAVE_JOINED_EVENTS]: saveJoinedEvents,
  [Types.SET_LOCAL_SEND_ALERT]: setLocalSendAlert,
  [Types.GET_SELECTED_POST_REQUEST]: getSelectedPostRequest,
});
