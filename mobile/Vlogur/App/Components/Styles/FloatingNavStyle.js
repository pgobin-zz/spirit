import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    // bottom: 30,
    // width: 200,
    //  height: 450,
    // alignSelf: 'stretch',
    backgroundColor: 'red',
    // overflow: 'hidden' 
  },
  panel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // flex: 1,
    // backgroundColor: 'red',
    width: 132,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fafaff',
    flexDirection: 'row',
    // justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#d5d5d5',
    bottom: 20,
    position: 'absolute',

  },
  button: {
    // width: 66,
    height: 46,
    flex: 1,
    // backgroundColor: 'green',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'

  },
  homeIcon: {
    // backgroundPosition: 'center',
    // alignSelf: 'center',
    // flex: 1
    height: 26,
    // width: 30
  }
})
