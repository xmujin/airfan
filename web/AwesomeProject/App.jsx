import { Text, View, Button, TouchableOpacity,Modal, StyleSheet } from 'react-native'
import React, { Component, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import HomeScreen from './components/HomeScreen'
import Toast from 'react-native-toast-message';
import PopupMenu from './components/PopupMenu'
import NewDeviceScreen from './components/NewDeviceScreen';



const Stack = createNativeStackNavigator();
export default function App() {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <NavigationContainer>

      
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen 
        name="Login" 
        options={{headerShown: false}}
        component={LoginScreen} 
      />


      <Stack.Screen 
        options={{headerShown: true, title: '智能风扇', headerBackVisible:true,headerRight: ({ tintColor, canGoBack }) => (
            <PopupMenu />
        )
        }}
        name="Home" 
        component={HomeScreen} 
      />


      <Stack.Screen 
        options={{headerShown: false}}
        name="Register" 
        component={RegisterScreen} 
      />

      <Stack.Screen 
        options={{headerShown: true, title: '添加设备'}}
        name="NewDevice" 
        component={NewDeviceScreen} 
      />


    </Stack.Navigator>




    <Toast  />
    
  </NavigationContainer>
  
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

const triggerStyles = {
  triggerWrapper: {
    padding: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  triggerTouchable: {
    underlayColor: 'darkgrey',
    activeOpacity: 70,
  },
};

const optionsStyles = {
  optionsContainer: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  optionWrapper: {
    padding: 10,
  },
  optionText: {
    color: 'black',
  },
};