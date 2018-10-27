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


import { all, takeLatest } from 'redux-saga/effects';


import API from '../services/Api';
import FixtureAPI from '../services/FixtureApi';


import { AuthTypes } from '../redux/AuthRedux';
import { signup } from './AuthSaga';


// TODO: Move to config
const useFixtures = false;
const api = useFixtures ? FixtureAPI : API.create();


/**
 *
 * Construct sagas
 *
 *
 */
export default function * root() {
  yield all([

    // Auth
    takeLatest(AuthTypes.SIGNUP_REQUEST, signup, api)

  ]);
}
