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


import { call, put } from 'redux-saga/effects';
import AuthActions from '../redux/AuthRedux';


/**
 *
 * Execute signup API request
 *
 * The signup generator function executes a request to the
 * API for creating new user and handles the response.
 *
 * @param api
 * @param action
 *
 */
export function * signup (api, action) {
  try {
    const { name, email, password } = action;

    const res = yield call(api.signup, {
      name: name,
      email: email,
      password: password,
    });

    if (res.ok) {
      console.log('Signup successful');
      yield put(AuthActions.loginSuccess(true));
    } else {
      alert(res.data.message);
      yield put(AuthActions.loginFailure(res.data.message));
    }
  } catch (err) {
    console.error(err);
  }
}
