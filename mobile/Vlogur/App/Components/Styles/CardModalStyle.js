import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 30,
    // paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    // backgroundColor: 'blue'
  },
  top: {
      marginBottom: 0,
      backgroundColor: '#fbfbfe'
  },
  bottom: {
      marginTop: 0,
      padding: 16,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      backgroundColor: 'white'
  },
  backButton: {
      position: 'absolute',
      backgroundColor: 'transparent',
      top: 32,
      left: 10,
  },
  scrollContainer: {
      backgroundColor: 'red',
      height: 50,
      width: 60,
    //   flex: 3,
      position: 'absolute'
    //   flex: 1
  }
})
