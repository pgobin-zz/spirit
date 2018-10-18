import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Modal, Button, TouchableHighlight, TextInput } from 'react-native'
import styles from './Styles/AuthModalStyle'
import AuthScreen from '../Containers/AuthScreen'

export default class AuthModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  render () {
    return (
      <View style={styles.container}>
        <Button onPress={this.toggleModal} title="Login"/>
        {/* <Text>Login</Text> */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => false}>
        <Button onPress={this.toggleModal} title="Hide"/>
          <AuthScreen screenProps={{ toggleModal: this.toggleModal }}/>
        </Modal>
      </View>
    )
  }
}
