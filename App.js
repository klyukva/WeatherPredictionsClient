import Main from './components/Main';
import PredictionInput from './components/PredictionInput.js';
import TableTop from './components/TableTop';
import LastTenPredictions from './components/LastTenPredicions';
import {
  createAppContainer,
  createSwitchNavigator,
  withNavigation
} from 'react-navigation';
import Loading from './components/Loading';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

const predictionStackNavigator = createStackNavigator(
  {
    PredictionInput: { screen: PredictionInput },
    TableTop: { screen: TableTop },
    LastTenPredictions: { screen: LastTenPredictions }
  },
  { initialRouteKey: 'PredictionInput', initialRouteName: 'PredictionInput' }
);

const navigator = createSwitchNavigator(
  {
    Loading: { screen: Loading },
    Login: { screen: Login },
    SignUp: { screen: SignUp },
    Main: { screen: Main },
    App: predictionStackNavigator
  },
  {
    initialRouteName: 'Loading'
  }
);

console.disableYellowBox = true;

export default createAppContainer(navigator);
