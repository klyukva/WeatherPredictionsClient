import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

import Fire from '../Fire'
    
export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
            <ActivityIndicator size="large"/>
      </View>
    )
  }

  state = {unsubscribe: null};

  componentDidMount() {
    const navigation = this.props.navigation;
      this.setState({ 
          unsubscribe: Fire.shared.observeAuth( user => {
            navigation.navigate( user ? 'PredictionInput' : 'Login' );
      })
    });
  }
  componentWillUnmount() {
      this.state.unsubscribe();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});