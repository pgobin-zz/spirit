import React, { Component } from 'react'
import { View } from 'react-native'

import HomeScreen from './HomeScreen'
import FloatingNav from '../Components/FloatingNav'
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        {/* <HomeScreen/> */}
        <FloatingNav/>
      </View>
    )
  }
}
