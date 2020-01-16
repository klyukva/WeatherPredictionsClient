import Main from './components/Main';
import PredictionInput from './components/PredictionInput.js';
import TableTop from './components/TableTop';
import LastTenPredictions from './components/LastTenPredicions';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

const navigator = createStackNavigator({
  Main: { screen: Main },
  PredictionInput: { screen: PredictionInput },
  TableTop: { screen: TableTop },
  LastTenPredictions: { screen: LastTenPredictions }
});

export default createAppContainer(navigator);
