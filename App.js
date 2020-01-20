import Main from './components/Main';
import PredictionInput from './components/PredictionInput.js';
import TableTop from './components/TableTop';
import LastTenPredictions from './components/LastTenPredicions';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Loading from './components/Loading';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import React from 'react'

const PredictionsTabNavigator = createBottomTabNavigator({
  Submit: { screen: PredictionInput },
  Top: { screen: TableTop },
  Last: { screen: LastTenPredictions },
},
{
  initialRouteName: 'Submit',
  tabBarOptions: {
    activeTintColor: '#000000',
  },
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({ tintColor }) => {
      return <Icon type='font-awesome'
      name = 'behance'
      size = {25}/>
    },
  })
})

const navigator = createSwitchNavigator({
  Loading: { screen: Loading },
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Main: { screen: Main },
  PredictionInput: PredictionsTabNavigator,
},
{
  initialRouteName: 'Loading'
});

console.disableYellowBox = true;

export default createAppContainer(navigator);
