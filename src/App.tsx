import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {useEffect} from 'react';
import {createDatabase} from './utils/database';
import HomeScreen from './components/Home/screen';
import LoginScreen from './components/Login/screen';
import {GrayScaleColors} from './styles/colors';

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    createDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          options={{headerShown: false, statusBarColor: GrayScaleColors.BLACK}}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Home"
          options={{headerShown: false, statusBarColor: GrayScaleColors.BLACK}}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
