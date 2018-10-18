import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'

// import API from '../Services/Api'
// import SignUpScreen from './SignUpScreen'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import AuthActions from '../Redux/AuthRedux'

// Styles
import styles from './Styles/LoginScreenStyle'

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }

    // this.goBack = this.goBack.bind(this)
    // this.api = API.create();
  }

  componentWillReceiveProps (newProps) {
    ///this.forceUpdate()
    // Did the login attempt complete?
    // const { user } = this.props
    // const { screenProps } = this.props
    if (newProps.isLoggedIn) {
      this.props.navigation.navigate('HomeScreen')
      // this.props.navigation
      // screenProps.toggleModal()
    }
  }


  login = () => {
    const { email, password } = this.state;
    this.props.attemptLogin(email, password)
    Keyboard.dismiss();
  }

  openSignUp = () => {
    //alert();
    this.props.navigation.navigate('SignUpScreen')
  }

  render () {
    const { error } = this.props
    const {goBack} = this.props.navigation;

    return (
      // <ScrollView style={styles.container}>
      //   <KeyboardAvoidingView behavior='position'>
      //     <Text>LoginScreen</Text>
      //   </KeyboardAvoidingView>
      // </ScrollView>
      <View style={styles.container}>
        <View>
          <Button title='Dismiss' onPress={() => goBack()}/>

          <Text>Login</Text>

          <TextInput
            value={this.state.email} style={styles.inputField}
            autoCapitalize='none' textContentType='emailAddress'
            placeholder='Email' returnKeyType='next' keyboardType='email-address'
            enablesReturnKeyAutomatically={true} clearButtonMode='while-editing'
            autoCorrect={false}
            onChangeText={email => this.setState({ email })}/>
          <TextInput
            value={this.state.password} style={styles.inputField}
            autoCapitalize='none'
            secureTextEntry={true} placeholder='Password'
            autoCorrect={false}
            onChangeText={password => this.setState({ password })}/>

          <Text>{error}</Text>

          <Button onPress={this.login} title="Login"/>
          

                  <Text>Don't have an account?</Text>

          <TouchableHighlight
            onPress={() => {
              this.openSignUp()
              //this.props.screenProps.toggle()
            }}>
            <Text>Sign Up</Text>
          </TouchableHighlight>
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
    attemptLogin: (email, password) => dispatch(AuthActions.loginRequest(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
