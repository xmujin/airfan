import { View, Text, Button, FlatList, TouchableOpacity, PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';


export default function NewDeviceScreen() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  const deviceDiscoveredListener = (deviceEvent) => {

    setDevices((prevDevices) => {
      const deviceExists = prevDevices.some(device => device.id === deviceEvent.id);
      if (deviceExists) {
        return prevDevices;
      } else {
        return [...prevDevices, deviceEvent];
      }
    });



    

  };

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        await requestPermissions();
      }
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      setIsBluetoothEnabled(enabled);
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }
    };


    const sb = RNBluetoothClassic.onDeviceDiscovered(deviceDiscoveredListener);

    init();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const discoverDevices = async () => {
    try {


      Toast.show({
        type: 'success',
        text1: `开始扫描`,
        position: 'bottom',
        visibilityTime: 2000,
      });
      setDevices([]);
      const unpairedDevices = await RNBluetoothClassic.startDiscovery();      //setDevices(unpairedDevices);
      setDevices(unpairedDevices);
      //Alert.alert('扫描完成')
      
      
      //Alert.alert('' + unpairedDevices.length);

      // Toast.show({
      //   type: 'success',
      //   text1: `Found ${unpairedDevices.length} unpaired devices.`,
      //   position: 'bottom',
      //   visibilityTime: 2000,
      // });



    } catch (e) {
      //console.error(e);
    }
  };

  const connectDevice = async (device) => {
    try {
      const connected = await RNBluetoothClassic.connectToDevice(device.id);
      setConnectedDevice(connected);
    } catch (e) {
      console.error(e);
    }
  };

  const sendData = async (data) => {
    if (connectedDevice) {
      try {
        await RNBluetoothClassic.writeToDevice(connectedDevice.id, data);
        console.log('Data sent successfully');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


      <TouchableOpacity onPress={discoverDevices}>
        <Text>Discover Devices</Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connectDevice(item)}>
            <Text>{item.name || item.id}</Text>
          </TouchableOpacity>
        )}
      />

      {connectedDevice && (
        <TouchableOpacity onPress={() => sendData('Hello, Bluetooth!')}>
          <Text>Send Data</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
