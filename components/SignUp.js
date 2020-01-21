// SignUp.js
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Input, Button, ThemeProvider } from 'react-native-elements';
import Fire from '../Fire';
import { styles } from '../assets/styles';
export default class SignUp extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null };

  handleSignUp = () => {
    Fire.shared
      .signup(this.state.email, this.state.password, this.state.name)
      .then(userWithName =>
        this.props.navigation.navigate({
          routeName: 'PredictionInput',
          key: 'PredictionInput',
          params: { name: userWithName.name }
        }),
        error => this.setState({ errorMessage: error.message })
      );
    console.log('handleSignUp');
  };

  onSubmitEditingFirstInput = () => this.secondTextInput.focus();

  onSubmitEditingSecondInput = () => this.thirdTextInput.focus();

  onSubmitEditingThirdInput = () => this.handleSignUp();

  refFirstInput = input => (this.firstTextInput = input);

  refSecondInput = input => (this.secondTextInput = input);

  refThirdInput = input => (this.thirdTextInput = input);

  render() {
    return (
      <ThemeProvider style={styles.container}>
        <Text style={styles.text}>Sign Up</Text>
        {this.state.errorMessage && (
          <Text style={{ color: 'red', alignSelf: 'center' }}>
            {this.state.errorMessage}
          </Text>
        )}
        <Input
          ref={this.refFirstInput}
          onSubmitEditing={this.onSubmitEditingFirstInput}
          containerStyle={styles.inputContainer}
          placeholder='Nickname'
          autoCapitalize='none'
          style={styles.textInput}
          leftIcon={<Icon name='user' size={24} containerStyle={styles.icon} />}
          //iconLeft
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <Input
          ref={this.refSecondInput}
          onSubmitEditing={this.onSubmitEditingSecondInput}
          containerStyle={styles.inputContainer}
          placeholder='Email'
          autoCapitalize='none'
          style={styles.textInput}
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          ref={this.refThirdInput}
          onSubmitEditing={this.onSubmitEditingThirdInput}
          containerStyle={styles.inputContainer}
          secureTextEntry
          placeholder='Password'
          autoCapitalize='none'
          style={styles.textInput}
          leftIcon={{ type: 'font-awesome', name: 'unlock-alt' }}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          containerStyle={styles.buttonContainer}
          title='Sign Up'
          onPress={this.handleSignUp}
        />
        <Button
          containerStyle={styles.buttonContainer}
          type='outline'
          title='Already have an account? Login'
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </ThemeProvider>
    );
  }
}

/*const styles = StyleSheet.create({
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
      marginTop: 8
    }
  })*/
