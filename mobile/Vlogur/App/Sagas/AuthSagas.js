import { call, put } from 'redux-saga/effects'
import AuthActions from '../Redux/AuthRedux'
import MeActions from '../Redux/MeRedux'

export function * login (api, action) {
  try {
    const { email, password } = action
    const res = yield call(api.login, {
      email: email,
      password: password
    })

    if (res.ok) {
      yield put(AuthActions.loginSuccess(true))
      yield put(MeActions.meRequest())
    } else {
      yield put(AuthActions.loginFailure(res.data.error))
      alert(res.data.error)
    }
  } catch (err) {
    alert('Our servers are doing weird things. Try again.')
  }
}

export function * signup (api, action) {
  try {
    const { name, email, password } = action
    const res = yield call(api.signup, {
      name: name,
      email, email,
      password: password
    })

    if (res.ok) {
      yield put(AuthActions.signupSuccess(true))
      yield put(MeActions.meRequest())
    } else {
      yield put(AuthActions.signupFailure(res.data.error))
      alert(res.data.error)
    }
  } catch (err) {
    alert('Could not sign up. Try again.')
  }
}