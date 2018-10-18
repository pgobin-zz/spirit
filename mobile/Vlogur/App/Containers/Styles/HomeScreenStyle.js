import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  test: {
    // position: 'absolute',
    // bottom: 0,
    backgroundColor: 'red',
    height: 50

  },
  noPadding: {
    paddingTop: 0,
  },
  goo: {
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
    height: 50,
    // backgroundColor: backgroundColor.tra
    // justifyContent: 'center',
  },
  interstitialContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})
