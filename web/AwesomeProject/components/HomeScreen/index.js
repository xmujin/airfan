import { View, Text, Button, FlatList, TouchableOpacity, PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Alert  } from 'react-native'
import React, { useEffect, useState } from 'react'
import BleManager from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default function HomeScreen() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BleManager.start({ showAlert: false });

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log("User accept");
        } else {
          console.log("User refuse");
        }
      });
    }

    // Add event listeners
    const handleDiscoverPeripheral = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      (peripheral) => {
        console.log('Discovered peripheral', peripheral);
        setDevices(prevDevices => {
          const deviceExists = prevDevices.find(device => device.id === peripheral.id);
          if (deviceExists) {
            return prevDevices;
          }
          return [...prevDevices, peripheral];
        });
      }
    );

    const handleStopScan = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        console.log('Scan stopped');
      }
    );

    // Cleanup event listeners on unmount
    return () => {
      handleDiscoverPeripheral.remove();
      handleStopScan.remove();
    };
  }, []);

  const startScan = () => {
    setDevices([]);
    BleManager.scan([], 5, true).then(() => {
      console.log('Scanning...');
    }).catch(err => {
      console.error(err);
    });
  };

  const connectToDevice = (device) => {
    BleManager.connect(device.id)
      .then(() => {
        Alert.alert('已连接到' + device.id);
        BleManager.retrieveServices(device.id).then((peripheralInfo) => {
          console.log('Peripheral info:', peripheralInfo);

          // 开始接收通知
          BleManager.startNotification(device.id, serviceUUID, characteristicUUID).then(() => {
            console.log('Notification started');
            bleManagerEmitter.addListener(
              'BleManagerDidUpdateValueForCharacteristic',
              ({ value, peripheral, characteristic, service }) => {
                const buffer = Buffer.from(value);
                const data = buffer.toString();
                console.log(`Received data from ${peripheral} characteristic ${characteristic}:`, data);
                setTemperature(data);
              }
            );
          });
        });
      })
      .catch((error) => {
        Alert.alert('连接失败');
      });
  };



  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Scan for Devices" onPress={startScan} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.name? (
          <TouchableOpacity onPress={() => connectToDevice(item)}>


            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <Text>{item.name ? item.name : 'Unnamed Device'}</Text>
              <Text>{item.id}</Text>
            </View>
          </TouchableOpacity>
        ) : null} 
      />
    </View>
  );
};