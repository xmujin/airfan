import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';


export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(false);
    const devices = useCameraDevices();
    const device = devices[0];
    // useEffect(() => {
    //   const getPermissions = async () => {
    //     const status = await Camera.requestCameraPermission();
    //     setHasPermission(status === 'authorized');
    //   };
  
    //   getPermissions();
    // }, []);
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    camera: {
      width: '100%',
      height: '100%',
    },
  });