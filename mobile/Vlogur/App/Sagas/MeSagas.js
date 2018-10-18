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
import MeActions from '../Redux/MeRedux'
// import { MeSelectors } from '../Redux/MeRedux'



export function * me (api, action) {
  try {
    // const { liveOptions } = action
    // get current data from Store
    // const currentData = yield select(HomeSelectors.getData)
    // make the call to the api
    const res = yield call(api.me)

    // success?
    if (res.ok) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.
      yield put(MeActions.meSuccess(res.data))
    } else {
      yield put(MeActions.meFailure(res.data.error))
    }
  } catch (err) {
    alert('Couldn\'t get your channel info.')
    // yield put(MeActions.goLiveFailure(res.data.error))
  }
}