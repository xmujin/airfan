import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
const Stack = createNativeStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen 
          name="Login" 
          options={{headerShown: false}}
          component={LoginScreen} 
        />
        <Stack.Screen 
          options={{headerShown: false}}
          name="Home" 
          component={HomeScreen} 
        />


        <Stack.Screen 
          options={{headerShown: false}}
          name="Register" 
          component={RegisterScreen} 
        />


      </Stack.Navigator>
    </NavigationContainer>
    
    )
  }
}

