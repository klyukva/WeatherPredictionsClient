import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import Fire from '../Fire';

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  state = { unsubscribe: null };

  componentDidMount() {
    const navigation = this.props.navigation;
    this.setState({
      unsubscribe: Fire.shared.observeAuth(user => {
        if (user) {
          try {
            Fire.shared.getUserNameByUid(user.uid || user.user.uid, name => {
              console.log(`name in Loading: ${JSON.stringify(name)}`);
              navigation.navigate({
                routeName: 'PredictionInput',
                key: 'PredictionInput',
                params: { name }
              });
            });
          } catch (error) {
            Fire.shared
              .logout()
              .then(() =>
                navigation.navigate('Login', { errorMessage: error.message })
              );
          }
        } else {
          navigation.navigate('Login');
        }
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
    alignItems: 'center'
  }
});
