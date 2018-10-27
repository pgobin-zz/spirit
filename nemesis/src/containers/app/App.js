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


import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch } from 'react-router-dom';

// import logo from './logo.svg';
import './App.css';
import Signup from '../signup/Signup';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/signup' component={Signup}/>
        </Switch>
      </Router>
    );
  }
}


export default App;
