import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  Keyboard,
  KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import AuthActions from '../Redux/AuthRedux'

// Styles
// import API from '../Services/Api'

import styles from './Styles/SignUpScreenStyle'

class SignUpScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  componentWillReceiveProps (newProps) {
    ///this.forceUpdate()

    if (newProps.isLoggedIn) {
      this.props.navigation.navigate('HomeScreen')
    }
  }

  signup = () => {
    const { name, email, password } = this.state
    this.props.attemptSignup(name, email, password)
    Keyboard.dismiss();
  }

  render () {
    const {goBack} = this.props.navigation;
    return (
      // <ScrollView style={styles.container}>
      //   <KeyboardAvoidingView behavior='position'>
      //     <Text>SignUpScreen</Text>
      //   </KeyboardAvoidingView>
      // </ScrollView>

      <View style={styles.container}>
        <View>
        <Button title='Dismiss' onPress={() => goBack()}/>

          <Text>Sign Up</Text>

          <TextInput
            value={this.state.name} style={styles.inputField}
            autoCapitalize='none'
            placeholder='Name' returnKeyType='next'
            enablesReturnKeyAutomatically='true' clearButtonMode='while-editing'
            autoCorrect='false'
            onChangeText={name => this.setState({ name })}/>

          <TextInput
            value={this.state.email} style={styles.inputField}
            autoCapitalize='none' textContentType='emailAddress'
            placeholder='Email' returnKeyType='next' keyboardType='email-address'
            enablesReturnKeyAutomatically='true' clearButtonMode='while-editing'
            autoCorrect='false'
            onChangeText={email => this.setState({ email })}/>

          <TextInput
            value={this.state.password} style={styles.inputField}
            autoCapitalize='none'
            secureTextEntry='true' placeholder='Password'
            autoCorrect='false'
            onChangeText={password => this.setState({ password })}/>

          <Button onPress={this.signup} title="Sign Up"/>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    isLoggedIn: state.auth.isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptSignup: (name, email, password) =>
      dispatch(AuthActions.signupRequest(name, email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)
