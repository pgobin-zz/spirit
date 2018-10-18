import React, { Component } from 'react'
import { View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
  StatusBar,
  RefreshControl,
  SafeAreaView
} from 'react-native'
import { connect } from 'react-redux'

import { Images } from '../Themes'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'
import HomeActions, { HomeSelectors } from '../Redux/HomeRedux'
import MeActions, { MeSelectors } from '../Redux/MeRedux';

import CardModal from '../Components/CardModal'
import FloatingNav from '../Components/FloatingNav'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

// Styles
import styles from './Styles/HomeScreenStyle'


class HomeScreen extends Component {
  componentDidMount() {
    this.props.getRecommended();
  }

  componentWillReceiveProps(newProps) {
    const { isLoggedIn, fetching } = this.props

    // Not ready to check if new login has occurred
    if (isLoggedIn === null) return

    // Update home screen if on homepage after login
    if (!fetching && newProps.isLoggedIn !== isLoggedIn) {
      this.props.getRecommended(); // get me/recommended for current user
    }
  }

  // logout() {
  //   this.props.attemptLogout()
  // }

  // openLogin() {
  //   this.props.navigation.navigate('LoginScreen')
  // }

  openChannel() {
    this.props.navigation.navigate('LiveScreen')
  }

  renderVideoItem(video) {
    if (!video.channel_id) return null;
    return (
      // <UserItem key={user.id} user={user} />
      <CardModal
              
              key={video.channel_id}
              title={video.title}
              alias={video.channel_alias}
              video={video}
              description={'Description Text'}
              // image={}
              color={'#0E48BE'}
              content={'Lorem ipsum dolor sit amet, consectitur adipiscing elit.'}
              // navigation={this.props.navigation}
              onClick={() => {
                // this.openChannel()
              } }
              due={video.live_view_count}
              />
    );
  }

  renderLoading() {
    return (
      <View style={styles.interstitialContainer}>
        <Text>Loading</Text>
      </View>
    )
  }

  renderEmpty() {
    return (
      <View style={styles.interstitialContainer}>
        <Text>It's awfully quiet in here...</Text>
        <Button title='Try again' onPress={() => {this.props.getRecommended()}}/>
      </View>
    )
  }

  render () {
    const { isLoggedIn, recommended, me, fetching, getRecommended } = this.props;
    let isLoading, isEmpty

    // If loading in data or process hasn'e begun
    if (fetching || fetching === null) {
      isLoading = true
    }

    if (!fetching && recommended.length === 0) {
      isEmpty = true
    }

    return (
      <SafeAreaView style={[styles.container, styles.noPadding]}>
      <StatusBar barStyle='dark-content'/>
        { isLoading && this.renderLoading()}
        { isEmpty && this.renderEmpty()}

        {/* <KeyboardAvoidingView behavior='position'> */}
        {/* { me && <Text>{me.name}</Text>}
        {!isLoggedIn && <Button title='Login' onPress={() => this.openLogin()}/>}
        { isLoggedIn && <Button title='Logout' onPress={() => this.logout()}/>} */}

        {/* TODO: Investigate FlatList */}
        { !isEmpty &&
        <ScrollView
          style={[styles.container, styles.noPadding]}
          refreshControl={
            <RefreshControl
              refreshing={fetching}
              onRefresh={getRecommended}
            />
          }>
  
          {recommended.map(this.renderVideoItem)}
          
          {/* { !isLoggedIn && <AuthModal/>} */}
          {/* <DevscreensButton/> */}
        </ScrollView>
        }
        {/* <View style={styles.goo}>
          { isLoggedIn &&
            <TouchableOpacity style={styles.test} onPress={() => this.logout()}>
              <Text>Logout</Text>
            </TouchableOpacity>
          }
        </View> */}
        {/* </KeyboardAvoidingView> */}
        <FloatingNav {...this.props}/>
        {/* <FloatingNav/> */}

      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: AuthSelectors.isLoggedIn(state),
    recommended: HomeSelectors.getRecommended(state),
    me: MeSelectors.me(state),
    fetching: state.home.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogout: () => dispatch(AuthActions.logout()),
    getRecommended: () => dispatch(HomeActions.recommendedRequest()),
    resetMe: () => {
      dispatch(MeActions.meReset())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)





