import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text
} from 'react-native';

class TableTop extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Prediction'
  });

  render() {
    return (
      <View>
        <Text>TableTop</Text>
      </View>
    );
  }
}

export default TableTop;
