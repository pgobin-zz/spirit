import React, { Component } from 'react';
import { Animated, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

// import styles from './Styles/CardModalStyle';
// import ChatWidget from './ChatWidget'
// import { withNavigation } from 'react-navigation';

const { width, height } = Dimensions.get('window');

export function _onPress() {
  this.props.onClick();
  this.props.navigation.navigate('ChannelScreen', {
    video: this.props.video
  })
}

export function close() {
  this.setState({ pressed: !this.state.pressed });
  this.calculateOffset();
}

export function onLongPress() {
  this.setState({ pressed: !this.state.pressed });
  this.calculateOffset();
}

export function grow() {
  const testSpeed = 20;
  this.setState({ TopBorderRadius: 0, BottomBorderRadius: 0 });
  this.setState({ pressedStyle: { position: 'absolute', top: 0, zIndex: 999, }});
  Animated.parallel([
    Animated.spring(this.state.top_width, { toValue: width, speed: testSpeed }).start(),
    Animated.spring(this.state.top_height, { toValue: height / 2, speed: testSpeed }).start(), // toValue: 350   
    Animated.spring(this.state.bottom_width, { toValue: width, speed: testSpeed }).start(),
    Animated.spring(this.state.bottom_height, { toValue: 160, speed: testSpeed }).start(), // toValue: height/6 + 50
    Animated.spring(this.state.content_height, { toValue: 300, speed: testSpeed }).start(), // toValue: height/2
    Animated.spring(this.state.top_pan, { toValue: { x: 0, y: -30 }, speed: testSpeed }).start(), // y: -this.state.offset
    Animated.spring(this.state.content_pan, { toValue: { x: 0, y: 0 }, speed: testSpeed }).start(), // y: -(height/8  + this.state.offset)
    Animated.spring(this.state.bottom_pan, { toValue: { x: 0, y: -30 }, speed: testSpeed }).start(), // y: -(50 + this.state.offset)
    Animated.timing(this.state.content_opac, { toValue: 1 }).start(),
    Animated.timing(this.state.button_opac, { toValue: 1 }).start(),
    Animated.timing(this.state.back_opac, { toValue: 1 }).start(),
    Animated.timing(this.state.plus, { toValue: 0 }).start()
  ])
}

export function shrink() {
  const testSpeed=20
  this.setState({TopBorderRadius:15,BottomBorderRadius:0});
  this.setState({pressedStyle:{position:'relative',}});
  Animated.parallel([
    Animated.spring(this.state.top_width,{toValue:this.state.org_width,speed:testSpeed}).start(),
    Animated.spring(this.state.top_height,{toValue:this.state.org_height,speed:testSpeed}).start(),
    Animated.spring(this.state.bottom_height,{toValue:93,speed:testSpeed}).start(),
    Animated.spring(this.state.bottom_width,{toValue:this.state.org_width,speed:testSpeed}).start(),
    Animated.spring(this.state.top_pan,{toValue:{x:0,y:0},speed:testSpeed}).start(),
    Animated.spring(this.state.bottom_pan,{toValue:{x:0,y:0}}).start(),
    Animated.spring(this.state.content_height,{toValue:0}).start(),
    Animated.timing(this.state.content_opac,{toValue:0}).start(),
    Animated.timing(this.state.button_opac,{toValue:0}).start(),
    Animated.timing(this.state.back_opac,{toValue:0}).start(),
    Animated.timing(this.state.plus,{toValue:1}).start()
  ])
}

export function calculateOffset() {
  if (this.refs.container) {
    this.refs.container.measure((fx, fy, width, height, px, py) => {
      this.setState({ offset: py }, () => {
        if (this.state.pressed) {
          console.log('growing with offset', this.state.offset);
          this.grow();
        } else {
          console.log('shrinking with offset', this.state.offset);
          this.shrink();
        }
      })
    });
  }
}

export function activate() {
  this.setState({ activate: 'loading' });
  setTimeout(() => {
    this.setState({ activate: <Text>Activated  <Icon name='check' /></Text>, activated: true })
  }, 1500)
}

export const bindAll = (context) => {
  _onPress = _onPress.bind(context)
  onLongPress = onLongPress.bind(context)
  close = close.bind(context)
  calculateOffset = calculateOffset.bind(context)
  activate = activate.bind(context)
}