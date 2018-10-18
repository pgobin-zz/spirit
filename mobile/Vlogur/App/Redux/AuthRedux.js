import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['email', 'password'],
  loginSuccess: ['isLoggedIn'],
  loginFailure: ['error'],
  signupRequest: ['name', 'email', 'password'],
  signupSuccess: ['isLoggedIn'],
  signupFailure: ['error'],
  logout: null
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLoggedIn: null,
  fetching: null,
  error: null
})

/* ------------- Selectors ------------- */

export const AuthSelectors = {
  isLoggedIn: (state) => {
    return state.auth.isLoggedIn
  }
}

/* ------------- Reducers ------------- */

export const request = (state) => state.merge({ fetching: true })

export const success = (state, { isLoggedIn }) => {
  return state.merge({ fetching: false, error: null, isLoggedIn })
}

export const failure = (state, { error }) =>
  state.merge({ fetching: false, error, isLoggedIn: false })

export const logout = (state) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  // Share same reducers because end result both login
  // i.e., both have same side effect
  // Login
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT]: logout,

  // Signup
  [Types.SIGNUP_REQUEST]: request,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILURE]: failure,

  
})
