import React, { Component } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Button,
  StatusBar } from 'react-native'
import { connect } from 'react-redux'
import ChatWidget from '../Components/ChatWidget'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import ChannelActions, { ChannelSelectors } from '../Redux/ChannelRedux'
import Toast, {DURATION} from 'react-native-easy-toast'
import Images from '../Themes/Images'

import * as RNIap from 'react-native-iap';

// Styles
import styles from './Styles/ChannelScreenStyle'

const itemSkus = Platform.select({
  ios: [
    'com.vlogur.influence10'
  ],
  android: [
    'com.vlogur.influence10'
  ]
});

class ChannelScreen extends Component {

  constructor(props) {
    super(props)

    // const { navigation } = this.props
    // const video = navigation.state.params.video
    this.state = {
      products: null
    }
    this.showToast = this.showToast.bind(this)
  }

  async componentDidMount() {
    try {
      await RNIap.prepare();
      const products = await RNIap.getProducts(itemSkus);
      this.setState({ products });
    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }

  follow() {
    const { follow, isFollowing, navigation, isLoggedIn } = this.props

    if (isLoggedIn) {
      const video = navigation.state.params.video
      follow(video.alias, isFollowing) // unfollow if following, else follow
    } else {
      navigation.navigate('LoginScreen')
    }
  }

  subscribe() {
    const { subscribe, isSubscribed, navigation, isLoggedIn } = this.props

    if (isLoggedIn) {
      const video = navigation.state.params.video
      subscribe(video.alias, isSubscribed) // unsub if subbed, else sub
    } else {
      navigation.navigate('LoginScreen')
    }
  }

  showToast(notification) {
    this.refs.toast.show(notification);
  }

  render () {
    const { navigation, isSubscribed, isFollowing } = this.props;
    const video = navigation.state.params.video

    const subscribeButtonTitle = isSubscribed ? 'Unsubscribe' : 'Subscribe'
    const followButtonTitle = isFollowing ? 'Unfollow' : 'Follow'

    return (
      <View style={[styles.container, styles.noPadding]}> 
        <StatusBar barStyle='light-content'/>
        <View style={styles.videoContainer}>
          <SafeAreaView style={styles.header}>
            <TouchableOpacity>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={styles.profilePic} source=''/>
                <Text style={{color: '#fff'}}>{video.channel_alias}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={() =>this.follow()}>
              {/* <Text>Home</Text> */}
              <Image source={Images.headerMoreIcon} style={styles.headerMoreIcon} resizeMode='contain' />
            </TouchableOpacity>

          </SafeAreaView>
        {/* <View>
          </View> */}
        </View>
        <ScrollView style={styles.scrollContainer}>
          <KeyboardAvoidingView behavior='padding'>
            {/* <Text>ChannelScreen</Text> */}
            <View style={[styles.infoContainer]}>
              <Text style={styles.title}>{video.title}</Text>
              {/* <Text style={styles.watching}>X watching</Text> */}
            </View>
            {/* <Button onPress={() => this.follow()} title={followButtonTitle}/>
            <Button onPress={() => this.subscribe()} title={subscribeButtonTitle}/>} */}
          
            {/* <View style={{flex: 4}}> */}
            { video.channel_id && <ChatWidget showToast={this.showToast} isLive={true} channelId={video.channel_id}/>}
            {/* </View> */}
          </KeyboardAvoidingView>
        </ScrollView>
        <Toast ref="toast"/>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // const { alias } = this.state

  const { navigation } = ownProps
  const alias = navigation.state.params.video.alias
  // const alias = v
  return {
    isSubscribed: ChannelSelectors.isSubscribed(state, alias),
    isFollowing: ChannelSelectors.isFollowing(state, alias),
    isLoggedIn: state.auth.isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    follow: (id, unfollow) => dispatch(ChannelActions.followRequest(id, unfollow)),
    subscribe: (id, unsubscribe) => dispatch(ChannelActions.subscribeRequest(id, unsubscribe))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelScreen)
