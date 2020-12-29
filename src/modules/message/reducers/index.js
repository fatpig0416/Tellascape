import { createReducer, createActions } from 'reduxsauce';
import { INITIAL_STATE } from '../initialState';
import { static as Immutable } from 'seamless-immutable';

/* -------------Action Types and Action Creators ------------- */
const { Types, Creators } = createActions(
  {
    getContact: ['data'],
    getContactSuccess: ['response'],
    getContactFailure: ['error'],
  },
  {}
);

export const ContactAction = Types;
export default Creators;

/* ------------- Reducers ------------- */

export const getContact = (state = INITIAL_STATE, action) => {
  return Immutable.set(state, 'fetching', true);
};

export const getContactFailure = (state, action) => {
  return Immutable.merge(state, {
    fetching: false,
    error: true,
    errorMessage: action.error,
  });
};

export const getContactSuccess = (state, action) => {
  return Immutable.merge(state, {
    access_token: action.response.access_token,
    error: false,
    errorMessage: '',
    fetching: false,
    contacts: action.response.data,
  });
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CONTACT]: getContact,
  [Types.GET_CONTACT_SUCCESS]: getContactSuccess,
  [Types.GET_CONTACT_FAILURE]: getContactFailure,
});
