// Login.js
import React from 'react'
import { Text, Input, Button, ThemeProvider } from 'react-native-elements'
import {styles} from '../assets/styles'
import Fire from '../Fire'

export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null }  
  handleLogin = () => {
    Fire.shared.signIn(this.state.email, this.state.password)
      .then((userWithName) => this.props.navigation.navigate('PredictionInput',
      {
        name: userWithName.name
      }))
      .catch(error => this.setState({ errorMessage: error.message }))
    console.log('handleLogin')
  }  
  render() {
    return (
      // <View >
      <ThemeProvider style={styles.inputContainer}>
        <Text style = {styles.text}>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <Input 
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          containerStyle={styles.inputContainer}
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <Input
          secureTextEntry
          containerStyle={styles.inputContainer}
          style={styles.textInput}
          leftIcon={{ type: 'font-awesome', name: 'unlock-alt' }}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          containerStyle={styles.buttonContainer}
          style={styles.button}
          title="Login" 
          onPress={this.handleLogin} />
        <Button
          type='outline'
          containerStyle={styles.buttonContainer}
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
        </ThemeProvider>
    )
  }
}

/*const styles = StyleSheet.create({
  inputContainer: {
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
    paddingVertical: '3%'
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '60%'
  }
})*/