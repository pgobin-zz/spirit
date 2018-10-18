import { StyleSheet } from 'react-native'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  container: {

  },
  modal: {
    // height: 400
  },
  menu: {
    backgroundColor: '#fff',
    flex:3,
    // alignItems: 'kflex-end',
    flexDirection: 'column',

  },
  menuButton: {
    fontSize: 19,
    color: 'gray',
    fontWeight: '600',
    paddingLeft: 80,
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20
    // backgroundColor:'red'
    // position: 'absolute',
    // bottom: 30
  },
  voltButton: {
    color: 'red'
  },
  primaryButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  touchOverlay: {
    // flex: 1,
  },
  touchOverlayView: {
    flex: 3,
    backgroundColor: Colors.transparent
  },
  homeIconGlobalMenu: {
    height: 26,
    // width: 30
  }
})
