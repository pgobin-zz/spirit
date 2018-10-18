import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  recommendedRequest: null,
  recommendedSuccess: ['recommended'],
  recommendedFailure: ['error']
})

export const HomeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  recommended: [],
  fetching: null,
  error: null
})

/* ------------- Selectors ------------- */

export const HomeSelectors = {
  getRecommended: (state) => {
    return state.home.recommended
  }
}

/* ------------- Reducers ------------- */

// Get recommended
export const recommendedRequest = (state) => state.merge({ fetching: true })

// successful api lookup
export const recommendedSuccess = (state, { recommended }) => {
  return state.merge({ fetching: false, error: null, recommended })
}

// Something went wrong somewhere.
export const recommendedFailure = (state, { error }) =>
  state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RECOMMENDED_REQUEST]: recommendedRequest,
  [Types.RECOMMENDED_SUCCESS]: recommendedSuccess,
  [Types.RECOMMENDED_FAILURE]: recommendedFailure
})
