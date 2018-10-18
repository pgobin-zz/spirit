
import React, { Component } from 'react'
import {
  Button,
  View,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import ChatWidget from '../Components/ChatWidget'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import ChannelActions, { ChannelSelectors } from '../Redux/ChannelRedux'
import MeActions, { MeSelectors } from '../Redux/MeRedux'

// Styles
import styles from './Styles/LiveScreenStyle'
import AutoSuggest from 'react-native-autosuggest'

import Api from '../Services/Api'
import { Colors } from '../Themes/'

class LiveScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tag: '',
      tags: [],
      userTags: [],
      title: '',
      width: 0,
      colors: [
        { backgroundColor: '#dc7b94', color: '#6a4552'}, // pink
        { backgroundColor: '#617dd4', color: '#234985'}, // blue
        { backgroundColor: '#61c6d4', color: '#18465b'}, //teal
        { backgroundColor: '#d47d61', color: '#451934'}, //orange
      ]
    }
    this.api = Api.create('http://192.168.0.3:7000')
    this.renderTag = this.renderTag.bind(this)
  }

  componentDidMount() {
    const { me } = this.props
    console.log('foo')
    this.props.getChannel(me.alias)
  }

  componentWillReceiveProps(newProps) {
    // if (newProps.error) {
    //   alert(newProps.error)
    // }
  }
  goLive() {
    const { isLive, goLive } = this.props
    const { userTags, title } = this.state

    let tags = userTags.map((item) => item.name)
   
    goLive({
      stop: isLive,
      title: title,
      tags: tags,
    })
  }

  async search(text) {
    this.setState({ tag: text })
    let result = await this.api.search(text)
    if (result.data) {
      let suggestions = result.data.tags.map((tag) => {
        return tag._source.name
      })
      this.setState({ suggestions })
      console.log(suggestions)
    }
  }

  createTag(item) {
    const { userTags, tag, colors } = this.state
    
    // TODO: Validate
    // ...

    let final = {
      name: item,
      style: colors[Math.floor(Math.random() * colors.length)]
    }

    this.setState({ userTags: [final, ...userTags], tag: '' })
    console.log('MY TAGS: ', userTags)
    // alert('Created tag')
  }

  removeTag(tagName) {
    const { userTags } = this.state
    this.setState({ userTags: userTags.filter((item) => item.name !== tagName) })
    // alert('remove' + tagName)
  }

  renderTag(tag) {
    const { colors, userTags } = this.state
    

    return (
      <TouchableHighlight key={tag} style={[styles.createdTag, { backgroundColor: tag.style.backgroundColor }]}>
        <View style={styles.tagInnerView}>
          <Button title='X' onPress={() => { this.removeTag(tag.name) }}/>
          <Text style={{ fontSize: 16, color: tag.style.color}}>{tag.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render () {
    const { isLive, me } = this.props
    const { suggestions, userTags, tag, title } = this.state
    const buttonTitle = isLive ? 'Stop' : 'Go Live'
    // const

    const textInputOptions = {
      autoCapitalize: 'none',
      onSubmitEditing: () => { this.createTag(tag)},
      value: tag,
      onContentSizeChange: (event) => {
        this.setState({ width: event.nativeEvent.contentSize.width + 50 })
      },
      autoCorrect: false,
      maxLength: 28
    }
    return (
      // <View style={[styles.container, { paddingTop: 0}]}>
        <KeyboardAvoidingView behavior='padding' style={[styles.container, { flex: 1, flexDirection: 'column', paddingTop: 0}]}>
          <StatusBar barStyle='light-content'/>
          <View style={[styles.videoContainer]}>
            <SafeAreaView>
              <TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={styles.profilePic} source=''/>
                  <Text style={{color: '#fff'}}>{me.name}</Text>
                </View>
              </TouchableOpacity>
            </SafeAreaView>
          </View>

          <View style={{ backgroundColor: '#3d3d3d', flex: 1}}>

            {/* Edit title */}
            { !isLive &&
            <TextInput
              onChangeText={(text) => this.setState({ title: text })}
              placeholderTextColor='gray'
              style={styles.titleField}
              value={title}
              multiLine={true}
              placeholder='A title goes here...'
            />
            }

            {/* Add tags */}
            { !isLive &&
            <View style={styles.tagsSection}>
              <AutoSuggest
                onItemPress={(item) => this.createTag(item)}
                containerStyles={{
                  backgroundColor: Colors.transparent,
                  width: Math.max(110, this.state.width),
                  marginRight: 10,
                  marginBottom: 10

                }}
                textInputStyles={styles.tag}
                onChangeText={(text) => this.search(text)}
                placeholder='Tag'
                terms={suggestions}
                otherTextInputProps={textInputOptions}
              />
              { userTags.map(this.renderTag) }
            </View>
            }

            {/* Go live button */}
            <Button title={buttonTitle} onPress={() => this.goLive()}/>
            { isLive && <Text>You are live</Text> }


          </View>

            {/* { me && <ChatWidget isLive={isLive} channel={me.alias}/>} */}
      {/* </SafeAreaView> */}
        </KeyboardAvoidingView>
        
      
      // </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel.channel,
    isLive: state.channel.isLive,
    error: state.me.error,
    me: MeSelectors.me(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getChannel: (id) => dispatch(ChannelActions.channelRequest(id)),
    goLive: (liveOptions) => dispatch(ChannelActions.goLiveRequest(liveOptions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScreen)
