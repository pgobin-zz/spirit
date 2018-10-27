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
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';


/**
 *
 * @class SignupForm
 * Component encapsulating signup form
 *
 *
 *
 */
export default class SignupForm extends Component {

  constructor (props) {
    super(props);

    this.state = { name: '', email: '', password: '' };
  }


  /**
   *
   * @param event   Event passed by Semantic UI
   * @param name    Name of form element derived from 'name' HTML attribute
   * @param value   Value of form field
   *
   */
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  }


  render () {
    const { submit } = this.props;
    const { name, email, password } = this.state;

    return (
      <Form onSubmit={() => submit(name, email, password)}>
        <Form.Input
          label='Name'
          placeholder='Name'
          name='name'
          onChange={this.handleChange}/>
        <Form.Input
          label='Email'
          placeholder='email'
          name='email'
          type='email'
          onChange={this.handleChange}/>
        <Form.Input
          label='Password'
          placeholder='Password'
          name='password'
          type='password'
          onChange={this.handleChange}/>
        <Form.Button content='Sign Up'/>
      </Form>
    );
  }

}


SignupForm.proptypes = {
  submit: PropTypes.func.isRequired
};
