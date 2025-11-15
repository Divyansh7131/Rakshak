import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../components/SplashScreen';
import Login from '../components/Login';
import Register from '../components/Register';
import Forgotpassword from '../components/Forgotpassword';
import  Tabnavigation from './Tabnavigation'; // create this file next

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} ></Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={Forgotpassword} ></Stack.Screen>
      <Stack.Screen name="MainApp" component={ Tabnavigation} />
    </Stack.Navigator>
      );
}
