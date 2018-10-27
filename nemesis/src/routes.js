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
import Signup from './containers/signup/Signup';


/**
 *
 * Destructured routes
 *
 * The routes in this array are destructured from the declarative
 * syntax due to the added complexity of navigation and state.
 *
 * State is sent top-down via props to the main and nav
 * components.
 *
 */
const routes = (props) => [

  /**
   *
   * Routes
   *
   *
   *
   */

  {
    path:   '/signup',
    main:   () => <Signup {...props} />,
    exact:  true
  }

];


export default routes;
