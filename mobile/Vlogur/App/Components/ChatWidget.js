import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TextInput, Button, ScrollView } from 'react-native'
import styles from './Styles/ChatStyle'

import Chat from '../Services/Chat'

export default class ChatWidget extends Component {
  componentWillReceiveProps (newProps) {
    // is live returned from api and state is up-to-date
    // then:
    // const { channel } = this.state
    // if (newProps.isLive) {
    //   // Join channel room if exists, else create one
    //   this.chat.createRoom(channel)
    // }
  }

  componentDidMount() {
    const { isLive, channelId } = this.props
    if (isLive) {
      this.chat.joinRoom(channelId)
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      message: '',
      messages: [],
      channelId: props.channelId
    }
    // Chat service
    this.chat = Chat.create();

    this.chat.onMessage((newMessage) => {
      this.setState({ messages: [...this.state.messages, newMessage] })
    })

    this.chat.onNotification((notification) => {
      // alert(notification)
      this.props.showToast(notification)
    })
  }

  sendMessage() {
    const { message, channelId } = this.state
    this.chat.sendMessage(channelId, message);
    this.setState({ message: '' })
  }
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  renderMessageItem(message) {
    if (!message.msg) return
    return (
      <View style={styles.message}>
        <Text style={styles.messageFrom}>{message.from}</Text>
        <Text style={styles.messageBody}>{message.msg}</Text>
      </View>    
    )
  }

  render () {
    const { messages, message } = this.state
    return (
      <View style={styles.container}>
        {/* <Text>Live Chat</Text> */}
        <ScrollView style={styles.scrollView}>
          {messages.map(this.renderMessageItem)}
        </ScrollView>
        <TextInput
          keyboardAppearance='dark'
          style={styles.messageField}
          autoCorrect={false}
          value={message}
          placeholder='Send a message...'
          placeholderTextColor='gray'
          onChangeText={message => this.setState({ message })}/>
        <Button style={styles.sendButton} title='Send' onPress={() => this.sendMessage() }/>
      </View>
    )
  }
}