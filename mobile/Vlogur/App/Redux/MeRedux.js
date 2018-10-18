import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({

  meRequest: null,
  meSuccess: ['userInfo'],
  meFailure: ['error'],
  meReset: null
})

export const MeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  // isLive: false,
  userInfo: null,
  fetching: null,
  error: null
})

/* ------------- Selectors ------------- */

export const MeSelectors = {
  // isLive: state => state.me.isLive,
  me: state => state.me.userInfo
}

/* ------------- Reducers ------------- */



// Me
export const meRequest = (state) =>
  state.merge({ fetching: true })

// TODO: share state (fetching, etc..)?
export const meSuccess = (state, action) => {
  const { userInfo } = action
  return state.merge({ fetching: false, error: null, userInfo })
}
export const meFailure = (state, { error }) =>
  state.merge({ fetching: false, error })

export const meReset = (state) => INITIAL_STATE


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {


  // Me
  [Types.ME_REQUEST]: meRequest,
  [Types.ME_SUCCESS]: meSuccess,
  [Types.ME_FAILURE]: meFailure,

  [Types.ME_RESET]: meReset,

})
