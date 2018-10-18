import { StackNavigator } from 'react-navigation'
import VoltScreen from '../Containers/VoltScreen'
import ChannelScreen from '../Containers/ChannelScreen'
import HomeScreen from '../Containers/HomeScreen'
import LiveScreen from '../Containers/LiveScreen'
import AuthScreen from '../Containers/AuthScreen'
import SignUpScreen from '../Containers/SignUpScreen'
import LoginScreen from '../Containers/LoginScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  VoltScreen: { screen: VoltScreen },
  ChannelScreen: { screen: ChannelScreen },
  HomeScreen: { screen: HomeScreen },
  LiveScreen: { screen: LiveScreen },
  AuthScreen: { screen: AuthScreen },
  SignUpScreen: { screen: SignUpScreen },
  LoginScreen: { screen: LoginScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'HomeScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
