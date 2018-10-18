import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  noPadding: {
    paddingTop: 0
  },
  header: {
    // backgroundColor: '#161616',
    // height: 70,
    justifyContent: 'space-between',
    flexDirection: 'row',
    // // flex: 1,
    alignItems: 'center',
    // paddingLeft: 40,
    // paddingRight: 40,
    // paddingBottom: 20
  },
  alias: {
    color: '#fff'
  },
  headerMoreIcon: {
    height: 27
  },
  videoContainer: {
    // flex: 1,
    height: 350,
    backgroundColor: '#161616'
  },
  scrollContainer: {
    flex: 4,
    backgroundColor: '#3d3d3d'
  },
  title: {
    fontSize: 20,
    paddingLeft: 27,
    paddingTop: 27,
    paddingBottom: 13,
    color: '#cacaca'
  },
  watching: {
    paddingLeft: 27,
    paddingBottom: 27
  },
  profilePic: {
    marginRight: 10,
    marginLeft: 20,
    height: 36,
    width: 36,
    borderRadius: 18,
    // borderStyle: 'dashed',
    borderColor: '#fff',
    borderWidth: 1
    // backgroundColor: '#fff'
  },
  infoContainer: {
    // borderBottomColor: '#ddd',
    // borderBottomWidth: 1,
    // backgroundColor: 'red'
  }
})
