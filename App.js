import Main from './components/Main';
import PredictionInput from './components/PredictionInput.js';
import TableTop from './components/TableTop';
import LastTenPredictions from './components/LastTenPredicions';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Loading from './components/Loading';
import Login from './components/Login';
import SignUp from './components/SignUp';

const navigator = createSwitchNavigator({
  Loading: { screen: Loading },
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Main: { screen: Main },
  PredictionInput: { screen: PredictionInput },
  TableTop: { screen: TableTop },
  LastTenPredictions: { screen: LastTenPredictions }
},
{
  initialRouteName: 'Loading'
});

export default createAppContainer(navigator);
