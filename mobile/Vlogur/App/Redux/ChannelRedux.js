import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  goLiveRequest: ['liveOptions'],
  goLiveSuccess: ['isLive'],
  goLiveFailure: ['error'],

  channelRequest: ['id'],
  channelSuccess: ['channel'],
  channelFailure: ['error'],

  followRequest: ['id', 'unfollow'],
  followSuccess: ['following'],
  followFailure: ['error'],

  subscribeRequest: ['id', 'unsubscribe'],
  subscribeSuccess: ['subscriptions'],
  subscribeFailure: ['error'],
})

export const ChannelTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  following: {},
  subscriptions: {},
  fetching: null,
  payload: null,
  error: null,
  channel: {},
  isLive: false
})

/* ------------- Selectors ------------- */

export const ChannelSelectors = {
  getData: state => state.data,
  isLive: state => {
    return state.channel.channel.is_live
  },
  isFollowing: (state, alias) => {
    const following = state.channel.following
    
    for (key in following) {
      if (key === alias && following[key] === true) {
        return true
      }
    }

    return false;
  },
  isSubscribed: (state, alias) => {
    const subscriptions = state.channel.subscriptions
    
    // look through key/value store to see if subscribed to channel given by alias
    // from component

    // { SomeAlias: false, AnotherAlias: true }
    for (key in subscriptions) {
      if (key === alias && subscriptions[key] === true) {
        return true
      }
    }
    
    return false;
  }
}

/* ------------- Reducers ------------- */

// Go Live
export const goLiveRequest = (state) =>
  state.merge({ fetching: true })

export const goLiveSuccess = (state, action) => {
  const { isLive } = action
  return state.merge({ fetching: false, error: null, isLive })
}
export const goLiveFailure = (state, { error }) =>
  state.merge({ fetching: false, error })

export const request = (state) =>
  state.merge({ fetching: true })
export const success = (state, action) => {
  const { channel } = action
  const isLive = channel.is_live
  return state.merge({ fetching: false, channel, isLive: isLive })
}
export const failure = state =>
  state.merge({ fetching: false, error: true })


  // Following
export const followRequest = (state) =>
  state.merge({ fetching: true })
export const followSuccess = (state, action) => {
  const { following } = action
  return state.merge({ fetching: false, following })
}
export const followFailure = state =>
  state.merge({ fetching: false, error: true})

  //Subs
export const subscribeRequest = (state) =>
  state.merge({ fetching: true})
export const subscribeSuccess = (state, action) => {
  const { subscriptions } = action
  return state.merge({ fetching: false, subscriptions })
}
export const subscribeFailure = state =>
  state.merge({ fetching: false, error: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANNEL_REQUEST]: request,
  [Types.CHANNEL_SUCCESS]: success,
  [Types.CHANNEL_FAILURE]: failure,

  [Types.FOLLOW_REQUEST]: followRequest,
  [Types.FOLLOW_SUCCESS]: followSuccess,
  [Types.FOLLOW_FAILURE]: followFailure,

  [Types.SUBSCRIBE_REQUEST]: subscribeRequest,
  [Types.SUBSCRIBE_SUCCESS]: subscribeSuccess,
  [Types.SUBSCRIBE_FAILURE]: subscribeFailure,

    // Go Live
    [Types.GO_LIVE_REQUEST]: goLiveRequest,
    [Types.GO_LIVE_SUCCESS]: goLiveSuccess,
    [Types.GO_LIVE_FAILURE]: goLiveFailure,
})
