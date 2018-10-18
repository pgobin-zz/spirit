import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    // backgroundColor: 'red'
  },
  scrollView: {
    flex: 1
  },
  messageFrom: {
    fontSize: 14,
    color: 'orange',
    marginRight: 8,
    fontWeight: '600'
  },
  messageBody: {
    fontSize: 14,
    color: '#cacaca',
    marginBottom: 10
  },
  message: {
    flexDirection: 'row',
    paddingLeft: 27,
    paddingRight: 27
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  messageField: {
    paddingLeft: 27,
    paddingRight: 27,
    fontSize: 17,
    color: '#cacaca'
  }
})
