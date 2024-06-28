import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor  } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';


export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices[0];
    const cameraRef = React.useRef(null);
    // useEffect(() => {
    //   const getPermissions = async () => {
    //     const status = await Camera.requestCameraPermission();
    //     setHasPermission(status === 'authorized');
    //   };
  
    //   getPermissions();
    // }, []);

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
        

        await fetch('http://192.168.163.160:5000/detect', {
          method: 'POST',
          body: JSON.stringify({
            image: base64Image,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => response.json())
        .then(result => {
          console.log('Detection result:', result);
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