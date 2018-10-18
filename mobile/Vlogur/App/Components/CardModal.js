import React, { Component } from 'react';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import styles from './Styles/CardModalStyle';
import ChatWidget from './ChatWidget'
import { withNavigation } from 'react-navigation';
import {
  _onPress,
  close,
  onLongPress,
  grow,
  shrink,
  calculateOffset,
  activate,
  bindAll
} from './CardModalHelper'
const { width, height } = Dimensions.get('window');

export class CardModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressedStyle: {},
      org_width: width - 32,
      org_height: height / 3, // org_height: 190,
      top_width: new Animated.Value(width - 32),
      top_height: new Animated.Value(height / 3.8), // top_height: new Animated.Value(190),
      bottom_width: new Animated.Value(width - 32),
      bottom_height: new Animated.Value(93),
      content_height: new Animated.Value(0),
      top_pan: new Animated.ValueXY(),
      bottom_pan: new Animated.ValueXY(),
      content_pan: new Animated.ValueXY(),
      content_opac: new Animated.Value(0),
      button_opac: new Animated.Value(0),
      back_opac: new Animated.Value(0),
      plus: new Animated.Value(1),
      TopBorderRadius: 15,
      BottomBorderRadius: 0,
      activate: 'Follow',
      activated: false,
      offset: 0,
      pressed: false,
    };

    bindAll(this)
  }

  renderTop() {
    var back = this.state.pressed ?
      <TouchableOpacity style={[styles.backButton]} onPress={close}>
        <Animated.View style={{ opacity: this.state.back_opac }}>
          <Text style={{ color: 'black' }}><Icon name='arrow-left' size={23} /></Text>
        </Animated.View>
      </TouchableOpacity>
      : <View />

    const borderStyles = !this.state.pressed ? {
      borderTopLeftRadius: this.state.TopBorderRadius,
      borderTopRightRadius: this.state.TopBorderRadius,
      overflow: 'hidden'
    } : {}
    return (
      <Animated.View style={[borderStyles,]}>
        <Animated.Image source={this.props.image}
          style={[styles.top, {
            width: this.state.top_width,
            height: this.state.top_height,
            transform: this.state.top_pan.getTranslateTransform()
          }]}>
        </Animated.Image>
        {back}
      </Animated.View>
    )
  }

  renderBottom() {
    var loading = this.state.activate == 'loading' ?
      <ActivityIndicator animating={true} color='white' />
      : <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>{this.state.activate}</Text>;

    var button = this.state.pressed ?
      <TouchableOpacity onPress={activate} onLongPress={onLongPress}>
        <Animated.View style={{
          opacity: this.state.button_opac, backgroundColor: this.props.color,
          marginTop: 10, borderRadius: 13, width: width - 64, height: 50, alignSelf: 'center',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {loading}
        </Animated.View>
      </TouchableOpacity> : null

    return (
      <Animated.View style={[styles.bottom,
      {
        width: this.state.bottom_width,
        height: this.state.bottom_height,
        borderRadius: this.state.BottomBorderRadius,
        transform: this.state.bottom_pan.getTranslateTransform()
      }]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 4 }}>
            <Text style={{ color: '#4a4a4a', fontSize: 16, fontWeight: '600', paddingBottom: 8 }}>{this.props.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#4a4a4a', fontSize: 12, fontWeight: '500', paddingBottom: 10 }}>{this.props.alias}</Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray' }}>{this.props.due}</Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: 'gray' }}>4.5K</Text>
            </View>
          </View>
        </View>
        {button}
      </Animated.View>
    )
  }

  renderContent() {
    if (!this.state.pressed) {
      return
    }
    return (
      <Animated.View style={{
        opacity: this.state.content_opac, marginTop: 40, width: width, height: this.state.content_height, zIndex: -1,
        backgroundColor: '#ddd', transform: this.state.content_pan.getTranslateTransform()
      }}>
        <View style={{ backgroundColor: 'white', flex: 1, margin: 16, padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'black' }}>Description</Text>
          <Text style={{ color: 'gray', paddingTop: 10 }}>{this.props.content}</Text>
        </View>
      </Animated.View>
    )
  }

  renderChat() {
    if (!this.state.pressed) {
      return
    }
    return (
      <Animated.View style={{
        opacity: this.state.content_opac, marginTop: 40, width: width, height: 600, zIndex: -1,
        backgroundColor: '#ddd', transform: this.state.content_pan.getTranslateTransform()
      }}>
        <ChatWidget isLive={true} channelId={this.props.alias} />
      </Animated.View>
    )
  }

  render() {
    return (
      <View style={[styles.container, this.state.pressedStyle]}>
        {this.state.pressed && <StatusBar hidden={true} />}
        <TouchableWithoutFeedback
          onPress={!this.state.pressed ? _onPress : null} onLongPress={onLongPress}>
          <View ref="container"
            style={[{ alignItems: 'center' }]}>
            {this.renderTop()}
            {this.renderBottom()}
            {/* {this.renderContent()} */}
            {/* {this.state.pressed && this.renderChat()} */}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default withNavigation(CardModal);
