import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, Button, Modal, Image, TouchableWithoutFeedback, TouchableHighlight } from 'react-native'
import styles from './Styles/GlobalMenuStyle'
import { withNavigation } from 'react-navigation';
import Images from '../Themes/Images'

class GlobalMenu extends Component {
  constructor(props) {
    super(props)
    
    this.openLogin = this.openLogin.bind(this)
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
  openLogin() {
    const { toggleMenu, navigation } = this.props
    toggleMenu()
    navigation.navigate('LoginScreen')
  }

  openVolt() {
    const { toggleMenu, navigation } = this.props
    toggleMenu()
    navigation.navigate('VoltScreen')
  }

  logout() {
    this.props.attemptLogout()
    this.props.resetMe()
  }

  render () {
    const { toggleMenu, visible, isLoggedIn, me } = this.props

    return (
     <View style={styles.container}>
      
        <Modal
          // style={styles.modal}
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => false}>

          <TouchableWithoutFeedback style={styles.touchOverlay} onPress={toggleMenu}>
            <View style={styles.touchOverlayView}/>
          </TouchableWithoutFeedback>
          
          <View style={styles.menu}>
            {/* <Text>Menu</Text> */}

            { !isLoggedIn &&
              <TouchableHighlight onPress={() => this.openLogin()} underlayColor='#eee'>
                <Text style={styles.menuButton}>Sign In</Text>
              </TouchableHighlight>
            }
            { isLoggedIn &&
              <TouchableHighlight onPress={() => this.logout()} underlayColor='#eee'>
                <Text style={styles.menuButton}>Sign Out</Text>
              </TouchableHighlight>
            }
            <TouchableHighlight onPress={() => this.openVolt()} underlayColor='#eee'>
              <Text style={[styles.menuButton, styles.voltButton]}>Get Volt</Text>
            </TouchableHighlight>


            <View style={styles.buttonRow}>
              <TouchableHighlight style={styles.primaryButton} onPress={() =>true} underlayColor='#eee'>
                <Text>Notifications</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.primaryButton} onPress={() =>toggleMenu()} underlayColor='#eee'>
                {/* <Text>Home</Text> */}
                <Image source={Images.homeIconGlobalMenu} style={styles.homeIconGlobalMenu} resizeMode='contain' />
              </TouchableHighlight>
              <TouchableHighlight style={styles.primaryButton} onPress={() =>true} underlayColor='#eee'>
                <Text>Add</Text>
              </TouchableHighlight>
              { !me && 
                <TouchableHighlight style={styles.primaryButton} onPress={() =>true} underlayColor='#eee'>
                  <Text>Generic image</Text>
                </TouchableHighlight>
              }
              { me && 
              <TouchableHighlight style={styles.primaryButton} onPress={() =>true} underlayColor='#eee'>
                <Text>{me.name}</Text> 
              </TouchableHighlight>
              }
            </View>


            {/* <Button onPress={toggleMenu} title="Hide"/> */}
          </View>

        </Modal>
      </View>
    )
    
    // )
  }
}

export default withNavigation(GlobalMenu);

