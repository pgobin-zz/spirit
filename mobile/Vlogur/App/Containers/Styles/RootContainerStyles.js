import {StyleSheet} from 'react-native'
import {Fonts, Metrics, Colors} from '../../Themes/'

export default StyleSheet.create({
  applicationView: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin
  },
  myImage: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  // floatingTest: {
  //   backgroundColor: 'red',
  //   width: 100,
  //   height: 50,
  //   position: 'absolute',
  //   bottom: 30,
  //   justifyContent: 'center',
  //   alignSelf: 'center',
  //   alignItems: 'center'
  // }
})
