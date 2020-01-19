import React from 'react';
import Fire from '../Fire';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native';
import { MessageBar, showMessage } from 'react-native-messages';
import { withNavigation } from 'react-navigation';
import cityNames from '../configs/citynames.json';

class PredictionInput extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Prediction'
  });

  state = {
    cityName: '',
    temperature: ''
  };
  
  get user() {
    return {
      name: this.props.navigation.getParam('name'),
      _id: Fire.shared.uid
    };
  }

  onChangeCityName = cityName => this.setState({ cityName });

  onChangeTemperature = temperature => this.setState({ temperature });

  isIncorrectFormat = (cityName, temperature) => {
    let errMessages = [];
    if (!cityName) {
      errMessages.push("Please, enter city's name");
    } else if (!cityNames.find(o => o == cityName)) {
      errMessages.push("Please, enter correct city's name");
      this.setState({ cityName: '' });
    }
    if (!temperature) {
      errMessages.push('Please, enter temperature');
    } else if (isNaN(temperature)) {
      errMessages.push('Please, enter correct temperature in correct format');
      this.setState({ temperature: '' });
    }
    if (errMessages.length) {
      showMessage(errMessages.join('\n'));
      return true;
    }
    return false;
  };

  onPress = () => {
    this.firstTextInput.blur();
    this.secondTextInput.blur();
    const { name } = this.user;
    const { cityName, temperature } = this.state;
    if (this.isIncorrectFormat(cityName, temperature)) {
      return;
    }
    Fire.shared.sendPrediction({ name, cityName, temperature });
    this.setState({ cityName: '', temperature: '' });
  };

  onPressTableTop = () => {
    this.props.navigation.navigate('TableTop', {
      name: this.props.navigation.getParam('name')
    });
  };

  onPressLastSelf = () => {
    this.props.navigation.navigate('LastTenPredictions', {
      name: this.props.navigation.getParam('name')
    });
  };

  componentWillUnmount() {
    Fire.shared.off(this.props.navigation.getParam('name'));
  }

  onLogOut (navigation) {
    return () => {
      try {
        Fire.shared.logout().then(() => navigation.navigate('Login'));
      } catch (e) {
        console.log(e);
      }
    }
  } 

  onSubmitEditingFirstInput = () => this.secondTextInput.focus();

  onSubmitEditingSecondInput = () => this.onPress();

  refFirstInput = input => (this.firstTextInput = input);

  refSecondInput = input => (this.secondTextInput = input);

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Enter city's name:</Text>
        <TextInput
          ref={this.refFirstInput}
          style={styles.nameInput}
          onChangeText={this.onChangeCityName}
          value={this.state.cityName}
          onSubmitEditing={this.onSubmitEditingFirstInput}
          blurOnSubmit={false}
        />
        <Text style={styles.title}>Enter temperature in celsius:</Text>
        <TextInput
          ref={this.refSecondInput}
          style={styles.nameInput}
          onChangeText={this.onChangeTemperature}
          value={this.state.temperature}
          keyboardType='numeric'
          onSubmitEditing={this.onSubmitEditingSecondInput}
          blurOnSubmit={false}
        />
        <View style={styles.button}>
          <TouchableOpacity onPress={this.onPress}>
            <Text style={styles.buttonText}>Make a guess</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonNavigatorRow}>
        <TouchableOpacity onPress={this.onLogOut(this.props.navigation)}>
            <Text style={styles.buttonText}>GTFO</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressTableTop}>
            <Text style={styles.buttonText}>Best scores</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressLastSelf}>
            <Text style={styles.buttonText}>My last predictions</Text>
          </TouchableOpacity>
        </View>
        <MessageBar />
      </View>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  title: {
    marginTop: offset / 2,
    marginLeft: offset,
    fontSize: offset
  },
  nameInput: {
    height: offset * 2,

    margin: offset / 2,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1
  },
  button: {
    marginLeft: offset / 2,
    flexDirection: 'row-reverse'
  },
  buttonNavigatorRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  buttonText: {
    margin: offset / 2,
    fontSize: offset
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default withNavigation(PredictionInput);
