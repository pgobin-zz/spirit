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


import FixtureAPI from '../services/FixtureApi';
import AuthActions from '../redux/AuthRedux';
import { signup } from '../sagas/AuthSaga';


const stepper = (fn) => (mock) => fn.next(mock).value;


test('first calls API', () => {
  const name = 'Jane Doe';
  const email = 'jane@example.com';
  const password = 'foobar';

  const step = stepper(signup(FixtureAPI, {
    name: name,
    email: email,
    password: password
  }));

  expect(step()).toEqual(call(FixtureAPI.signup, {
    name: name,
    email: email,
    password: password
  }));
});


test('success path', () => {
  const name = 'Jane Doe';
  const email = 'jane@example.com';
  const password = 'foobar';

  const res = FixtureAPI.signup(name, email, password);

  const step = stepper(signup(FixtureAPI, {
    name: name,
    email: email,
    password: password
  }));

  step();

  const stepRes = step(res);
  expect(stepRes).toEqual(put(AuthActions.signupSuccess(true)));
});


test('failure path', () => {
  const res = { ok: false, data: {} };

  const name = 'Jane Doe';
  const email = 'jane@example.com';
  const password = 'foobar';

  const step = stepper(signup(FixtureAPI, {
    name: name,
    email: email,
    password: password
  }));

  step();

  const stepRes = step(res);
  expect(stepRes).toEqual(put(AuthActions.signupFailure(res.data.error)));
});
