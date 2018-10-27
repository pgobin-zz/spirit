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


import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';


import Signup from './Signup';
import * as customStore from '../../customStore';


const store = customStore.create();


it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {};

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter><Signup {...props}/></BrowserRouter>
    </Provider>, div
  );

  ReactDOM.unmountComponentAtNode(div);
});
