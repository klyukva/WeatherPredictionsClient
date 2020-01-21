import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        height: 24
    },
    text: {
        paddingTop: '40%',
        fontSize: 20,
        alignSelf: 'center'
    },
    button: {
        width: '60%',
        marginHorizontal: '30px'
    },
    inputContainer: {
        flex: 1,
        //paddingVertical: '3%'
    },
    buttonContainer: {
        flex: 1,
        alignSelf: 'center',
        width: '60%'
    },
    icon: {
        width: '100%'
    }
  })