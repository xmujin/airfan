import { View, Text, Button, FlatList, TouchableOpacity, PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState();

  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        还未添加新设备，请点击右上角按钮添加
      </Text>

     
            

      
    </View>
  );
}
