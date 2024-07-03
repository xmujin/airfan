import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor  } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function CameraScreen({route}) {
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices[0];
    const cameraRef = React.useRef(null);
    useEffect(() => {
      const getPermissions = async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      };
  
      getPermissions();
    }, []);

    // const frameProcessor = useFrameProcessor((frame) => {
    //   'worklet'
    //   const objects = detectObjects(frame)
    // }, []);


    const takePhotoAndUpload = async () => {

      
      
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          width: 640,  // Reduce the resolution
          quality: 0.5, // 降低质量以减小文件大小
          base64: true, // 获取 base64 编码
        });

        const base64Image = await RNFS.readFile(photo.path, 'base64');
        
        console.log('拍照')
        await fetch('http://dontbeknow:5000/detect', {
          method: 'POST',
          body: JSON.stringify({
            image: base64Image,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(async result => {
          console.log('Detection result:', result);
          const blueDevice = route.params.device;
          
          
          if(result['label'] === 'like') {
            const cmd = {
              type: 'control',
              cmd: 'fan_on'
            };
            try {
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
              await RNBluetoothClassic.writeToDevice(blueDevice.id, JSON.stringify(cmd), "ascii");
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFE), "ascii");
            } catch (error) {
              console.log(error)
            }
          } else if(result['label'] === 'palm') {
            const cmd = {
              type: 'control',
              cmd: 'fan_off'
            };
            try {
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
              await RNBluetoothClassic.writeToDevice(blueDevice.id, JSON.stringify(cmd), "ascii");
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFE), "ascii");
            } catch (error) {
              console.log(error)
            }
          } else if(result['label'] === 'one') {
            const cmd = {
              type: 'control',
              cmd: 'one'
            };
            try {
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
              await RNBluetoothClassic.writeToDevice(blueDevice.id, JSON.stringify(cmd), "ascii");
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFE), "ascii");
            } catch (error) {
              console.log(error)
            }
          } else if(result['label'] === 'peace') {
            const cmd = {
              type: 'control',
              cmd: 'two'
            };
            try {
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
              await RNBluetoothClassic.writeToDevice(blueDevice.id, JSON.stringify(cmd), "ascii");
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFE), "ascii");
            } catch (error) {
              console.log(error)
            }
          } else if(result['label'] === 'ok') {
            const cmd = {
              type: 'control',
              cmd: 'three'
            };
            try {
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
              await RNBluetoothClassic.writeToDevice(blueDevice.id, JSON.stringify(cmd), "ascii");
              await RNBluetoothClassic.writeToDevice(blueDevice.id, String.fromCharCode(0xFE), "ascii");
            } catch (error) {
              console.log(error)
            }
          }
            
          





        })
        .catch(error => {
          console.error('Error:', error);
        });
        
      }
    };


    return (
      <View style={styles.container}>
        
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
        <TouchableOpacity style={{flex:0.1}} onPress={takePhotoAndUpload}>
          <Text style={{fontSize:32}}>拍照</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    camera: {
      flex:0.9,
      width: '100%',
      height: '100%',
    },
  });