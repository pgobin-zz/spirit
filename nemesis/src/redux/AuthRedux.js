/*



Copyright 2018-2019 Vlogur, Inc.
All Rights Reserved.

NOTICE: All information contained herein is, and remains
the property of Vlogur, Inc. and its suppliers, if any.

The intellectual and technical concepts contained
herein are proprietary to Vlogur Inc and its suppliers and may be
covered by U.S. and Foreign Patents, patents in process, and are
protected by trade secret or copyright law. Dissemination of this
information or reproduction of this material is strictly forbidden
unless prior written permission is obtained from Vlogur, Inc. */


import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';


/**
 *
 * Actions
 *
 * @property request  Initiating action
 * @property success  Action called on execution success
 * @property failure  Action called on execution failure
 *
 */
const { Types, Creators } = createActions({
  loginRequest:     ['username', 'password'],
  loginSuccess:     ['isAuthenticated'],
  loginFailure:     ['error'],

  signupRequest:    ['name', 'email', 'password'],
  signupSuccess:    ['isAuthenticated'],
  signupFailure:    ['error'],
});


export const AuthTypes = Types;
export default Creators;


/**
 *
 * State
 *
 * @property isAuthenticated
 * @property fetching
 * @property error
 *
 */
export const INITIAL_STATE = Immutable({
  isAuthenticated:  null,
  fetching:         null,
  error:            null
});


/**
 *
 * Selectors
 *
 *
 */
export const AuthSelectors = {
  isAuthenticated: (state) => {
    return state.auth.isAuthenticated;
  }
};


export const request = (state) => state.merge({ fetching: true });
export const success = (state, { isAuthenticated }) => {
  return state.merge({ fetching: false, isAuthenticated });
}
export const failure = (state, { error }) => {
  return state.merge({ fetching: false, error });
}


/**
 *
 * Reducers
 *
 *
 */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,

  [Types.SIGNUP_REQUEST]: request,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILURE]: failure
});
