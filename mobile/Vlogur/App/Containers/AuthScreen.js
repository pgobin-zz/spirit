import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import { StackNavigator } from 'react-navigation'


// Styles
import styles from './Styles/AuthScreenStyle'

import SignUpScreen from './SignUpScreen'
import LoginScreen from './LoginScreen'
import LiveScreen from './LiveScreen'



export default class AuthScreen extends Component {
  render () {
    const { screenProps } = this.props;
    return (
      <View style={styles.container}>
        {/* <TouchableHighlight
          onPress={() => {
            this.props.modalProps.toggleModal()
          }}>
          <Text>Hide Modal</Text>
        </TouchableHighlight> */}

        <LoginScreen screenProps={{ toggleModal: screenProps.toggleModal }}/>
      </View>
    )
  }
}


