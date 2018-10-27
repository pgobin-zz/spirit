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
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';


import './Signup.css';
import AuthActions, { AuthSelectors } from '../../redux/AuthRedux';
import SignupForm from '../../components/forms/SignupForm';


/**
 *
 * @class Signup
 * Component encapsulating the signup landing page.
 *
 *
 *
 */
class Signup extends Component {

  componentWillMount () {
  }


  componentWillReceiveProps (newProps) {
  }


  render () {
    const { attemptSignup } = this.props;

    return (
      <Grid centered columns={2}>
        <Grid.Column>
          <SignupForm submit={attemptSignup} />
        </Grid.Column>
      </Grid>
    );
  }

}


Signup.prototypes = {
};


const mapStateToProps = (state) => {
  return {
    error: state.auth.error
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptSignup: (name, email, password) => {
      return dispatch(AuthActions.signupRequest(name, email, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
