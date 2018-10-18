/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import ChannelActions from '../Redux/ChannelRedux'
// import { ChannelSelectors } from '../Redux/ChannelRedux'

export function * getChannel (api, action) {
  try {
    const { id } = action
    const res = yield call(api.getChannel, id)

    if (res.ok) {
      yield put(ChannelActions.channelSuccess(res.data))
    } else {
      alert(res.data.error)
      yield put(ChannelActions.channelFailure(res.data.error))
    }
  } catch (err){
    alert('Weird server error')
  }
}

export function * follow (api, action) {
  try {
    const { id, unfollow } = action
    const res = yield call(api.follow, { id: id, unfollow: unfollow })

    if (res.ok) {
      // If unfollow was sent in request, then key/value should be false for the id
      // so the selector sees it as unsubscribed
      let newState = !unfollow ? {
        [id]: true
      } : {
        [id]: false
      }
      yield put(ChannelActions.followSuccess(newState))
    } else {
      alert(res.data.error)
      yield put(ChannelActions.followFailure(res.data.error))
    }
  } catch (err){
    alert('Weird server error')
  }
}

export function * subscribe (api, action) {
  try {
    const { id, unsubscribe } = action
    const res = yield call(api.subscribe, { id: id, unsubscribe: unsubscribe })

    if (res.ok) {
      let newState = !unsubscribe ? {
        [id]: true
      } : {
        [id]: false
      }
      yield put(ChannelActions.subscribeSuccess(newState))
    } else {
      alert(res.data.error)
      yield put(ChannelActions.subscribeFailure(res.data.error))
    }
  } catch (err) {
    alert('Weird server error')
  }
}


export function * goLive (api, action) {
  try {
    const { liveOptions } = action
    // get current data from Store
    // const currentData = yield select(HomeSelectors.getData)
    // make the call to the api
    const res = yield call(api.goLive, {
      liveOptions: liveOptions
    })

    // success?
    if (res.ok) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.
      yield put(ChannelActions.goLiveSuccess(res.data.isLive))
    } else {
      alert(res.data.error)
      yield put(ChannelActions.goLiveFailure(res.data.error))
    }
  } catch (err) {
    alert('Huh...this is an error. Try that again.')
    // yield put(MeActions.goLiveFailure(res.data.error))
  }
}