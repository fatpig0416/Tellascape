import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../initialState';
import { static as Immutable } from 'seamless-immutable';
import AsyncStorage from '@react-native-community/async-storage';
import { createSelector } from 'reselect';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    verifyToken: ['data'],
    verifyTokenSuccess: ['response'],
    verifyTokenFailure: ['error'],
    verifyUsername: ['data'],
    verifyUsernameSuccess: ['response'],
    verifyUsernameFailure: ['response'],
    updateProfile: ['data'],
    updateProfileSuccess: ['response'],
    updateProfileFailure: ['error'],

    updateToken: ['data'],
  },
  {}
);

export const AuthAction = Types;
export default Creators;

/* ------------- Reducers ------------- */
export const setToken = (state = INITIAL_STATE, action) => {
  return Immutable.merge(state, {
    access_token: action.token.accessToken,
  });
};

export const verifyToken = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const verifyTokenFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const verifyTokenSuccess = (state, action) => {
  AsyncStorage.setItem('accessToken', action.response.access_token);

  return Immutable.merge(state, {
    access_token: action.response.access_token,
    error: false,
    errorMessage: '',
    provider: 'Phone',
    phone: action.response.phone,
    fetching: false,
    first_name: action.response.first_name,
    last_name: action.response.last_name,
    photo: action.response.profile_img,
    photo_lg: action.response.profile_img_lg,
    gender: action.response.gender,
    user_name: action.response.user_name,
    email: action.response.email,
    age: action.response.age,
    uid: action.response.uid,
  });
};

export const verifyUsername = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const verifyUsernameFailure = (state, action) => {
  action.response.verifyUsernameFailure();
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const verifyUsernameSuccess = (state, action) => {
  action.response.verifyUsernameSucess();
  return Immutable.merge(state, {
    error: false,
    errorMessage: '',
    fetching: false,
  });
};

export const updateProfile = (state, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const updateProfileFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const updateProfileSuccess = (state, action) => {
  const { response } = action;
  return Immutable.merge(state, {
    first_name: response.first_name,
    last_name: response.last_name,
    photo: response.profile_img,
    gender: response.gender,
    user_name: response.user_name,
    email: response.email,
    uid: response.uid,
    age: response.age,
    error: false,
    errorMessage: '',
    provider: 'Phone',
    fetching: false,
  });
};

export const updateToken = (state, action) => {
  return Immutable.merge(state, {
    access_token: action.data.access_token,
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.VERIFY_TOKEN]: verifyToken,
  [Types.VERIFY_TOKEN_SUCCESS]: verifyTokenSuccess,
  [Types.VERIFY_TOKEN_FAILURE]: verifyTokenFailure,
  [Types.VERIFY_USERNAME]: verifyUsername,
  [Types.VERIFY_USERNAME_SUCCESS]: verifyUsernameSuccess,
  [Types.VERIFY_USERNAME_FAILURE]: verifyUsernameFailure,
  [Types.UPDATE_PROFILE]: updateProfile,
  [Types.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [Types.UPDATE_PROFILE_FAILURE]: updateProfileFailure,
  [Types.UPDATE_TOKEN]: updateToken,
});

export const selectAuth = state => state.auth;

export const selectProvider = createSelector(
  [selectAuth],
  auth => auth.provider
);
export const selectAccessToken = createSelector(
  [selectAuth],
  auth => auth.access_token
);
export const selectPhoneNumber = createSelector(
  [selectAuth],
  auth => auth.phone
);
export const selectEmail = createSelector(
  [selectAuth],
  auth => auth.email
);
export const selectFirstName = createSelector(
  [selectAuth],
  auth => auth.first_name
);
export const selectLastName = createSelector(
  [selectAuth],
  auth => auth.last_name
);
export const selectUserName = createSelector(
  [selectAuth],
  auth => auth.user_name
);
export const selectPhoto = createSelector(
  [selectAuth],
  auth => auth.photo_lg
);
export const selectGender = createSelector(
  [selectAuth],
  auth => auth.gender
);
export const selectUid = createSelector(
  [selectAuth],
  auth => auth.uid
);
export const selectAge = createSelector(
  [selectAuth],
  auth => auth.age
);
