import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './Styles/FloatingNavStyle'
import GlobalMenu from './GlobalMenu'
import { withNavigation } from 'react-navigation';
import Images from '../Themes/Images'


class FloatingNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpen: false
    }
    this.toggleMenu = this.toggleMenu.bind(this);
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
  openLive() {
    const { me, navigation } = this.props

    if (!me) {
      navigation.navigate('LoginScreen')
    } else {
      navigation.navigate('LiveScreen')
    }
  }

  toggleMenu() {
    const { isMenuOpen} = this.state
    this.setState({ isMenuOpen: !isMenuOpen })
  }


  render () {
    return (
      <View style={styles.container} pointerEvents='box-none'>
        <GlobalMenu {...this.props} visible={this.state.isMenuOpen} toggleMenu={this.toggleMenu}/>
        {/* { !this.state.isMenuOpen &&  */}
        <View style={styles.panel}>
          <TouchableOpacity style={styles.button} onPress={this.toggleMenu}>
            {/* <Text>Home</Text> */}
            <Image source={Images.homeIconGlobalMenu} style={styles.homeIcon} resizeMode='contain' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this.openLive() }}>
            <Text>Live</Text>
          </TouchableOpacity>
          
        </View>
        {/* } */}
      </View>
    )
  }
}

export default withNavigation(FloatingNav);
