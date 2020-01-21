import React from "react";
import Fire from "../Fire";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from "react-native";
import { showMessage, MessageBar } from "react-native-messages";
import { ThemeProvider } from "react-native-elements";
import { withNavigation } from "react-navigation";
import cityNames from "../configs/citynames.json";

class PredictionInput extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Prediction"
  });

  state = {
    cityName: "",
    temperature: ""
  };

  get user() {
    return {
      name: this.props.navigation.getParam("name"),
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
      this.setState({ cityName: "" });
    }
    if (!temperature) {
      errMessages.push("Please, enter temperature");
    } else if (isNaN(temperature)) {
      errMessages.push("Please, enter correct temperature in correct format");
      this.setState({ temperature: "" });
    }
    if (errMessages.length) {
      showMessage(errMessages.join("\n"));
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
    this.setState({ cityName: "", temperature: "" });
  };

  onPressTableTop = () => {
    this.props.navigation.navigate("TableTop", {
      name: this.props.navigation.getParam("name")
    });
  };

  onPressLastSelf = () => {
    this.props.navigation.navigate("LastTenPredictions", {
      name: this.props.navigation.getParam("name")
    });
  };

  componentWillUnmount() {
    Fire.shared.off(this.props.navigation.getParam("name"));
  }

  onLogOut(navigation) {
    return () => {
      try {
        Fire.shared.logout().then(() => navigation.navigate("Login"));
      } catch (e) {
        console.log(e);
      }
    };
  }

  onSubmitEditingFirstInput = () => this.secondTextInput.focus();

  onSubmitEditingSecondInput = () => this.onPress();

  refFirstInput = input => (this.firstTextInput = input);

  refSecondInput = input => (this.secondTextInput = input);

  render() {
    return (
      <ThemeProvider style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.buttonTopNavigatorRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onLogOut(this.props.navigation)}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={this.refFirstInput}
              style={styles.nameInput}
              onChangeText={this.onChangeCityName}
              value={this.state.cityName}
              onSubmitEditing={this.onSubmitEditingFirstInput}
              placeholder="Enter city's name"
              blurOnSubmit={false}
            />
            <TextInput
              ref={this.refSecondInput}
              style={styles.nameInput}
              onChangeText={this.onChangeTemperature}
              value={this.state.temperature}
              keyboardType="numeric"
              placeholder="Enter temperature in celsius"
              onSubmitEditing={this.onSubmitEditingSecondInput}
              blurOnSubmit={false}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.onPress}>
                <Text style={styles.buttonText}>Make a guess</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonBottomNavigatorRow}>
              <TouchableOpacity onPress={this.onPressTableTop}>
                <Text style={styles.buttonText}>Top</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressLastSelf}>
                <Text style={styles.buttonText}>Last</Text>
              </TouchableOpacity>
            </View>
            <MessageBar />
        </View>
      </ThemeProvider>
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
    borderColor: "#111111",
    borderWidth: 1
  },
  buttonContainer: {
    marginLeft: offset / 2,
    flexDirection: "row-reverse"
  },
  buttonBottomNavigatorRow: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonTopNavigatorRow: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingTop: Expo.Constants.statusBarHeight
  },
  inputContainer: {
    flex: 0.4,
    width: "85%",
    alignSelf: "center"
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
