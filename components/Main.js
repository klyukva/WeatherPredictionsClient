import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native';
import { MessageBar, showMessage } from 'react-native-messages';

class Main extends React.Component {
  static navigationOptions = {
    title: 'Weather Prediction'
  };

  state = { name: '' };

  onPress = () => {
    if (!this.state.name) {
      showMessage('Please, enter name');
      return;
    }
    this.textInput.blur();
    this.props.navigation.navigate('PredictionInput', {
      name: this.state.name
    });
  };

  refInput = input => (this.textInput = input);

  onSubmitEditing = () => this.onPress();

  onChangeText = name => this.setState({ name });

  render() {
    return (
      <View>
        <Text style={styles.title}>Enter your name:</Text>
        <TextInput
          ref={this.refInput}
          style={styles.nameInput}
          onChangeText={this.onChangeText}
          value={this.state.name}
          onSubmitEditing={this.onSubmitEditing}
          blurOnSubmit={true}
        />
        <View style={styles.button}>
          <TouchableOpacity onPress={this.onPress}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        <MessageBar />
      </View>
    );
  }
}

const offset = 24;
const styles = StyleSheet.create({
  title: {
    marginTop: offset / 2,
    marginLeft: offset,
    fontSize: offset
  },
  nameInput: {
    height: offset * 2,

    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1
  },
  buttonText: {
    marginLeft: offset,
    fontSize: offset
  },
  button: {
    marginLeft: offset,
    flexDirection: 'row-reverse'
  }
});

export default Main;
