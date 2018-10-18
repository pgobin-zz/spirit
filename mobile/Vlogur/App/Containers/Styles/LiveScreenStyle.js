import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  tag: {
    backgroundColor: '#617dd4',
    borderRadius: 30,
    paddingLeft: 15,
    paddingRight: 0,
    fontSize: 16,
    color: '#234985'
  },
  videoContainer: {
    backgroundColor: '#161616',
    height: 350
  },
  tagInnerView: {
    flexDirection: 'row'
  },
  titleField: {
    marginTop: 30,
    marginLeft: 20,
    marginBottom: 60,
    fontSize: 20,
    color: 'lightgray'
  },
  createdTag: {
    borderRadius: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20
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
  }
})
