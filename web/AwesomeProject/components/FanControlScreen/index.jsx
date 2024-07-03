import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';
/**
 * tips:
 * 未连接到蓝牙或wifi，请连接后重试
 * 当前未连接到wifi，将使用蓝牙进行控制
 * 当前已连接到wifi, 但设备不在线，请将设备连接至网络，将使用蓝牙进行控制
 * 已连接到wifi，且设备在线，将使用wifi进行控制
 */

export default function FanControlScreen({route}) {
  /**   
   * 
   * 使用wifi来控制的前提是：需要通过蓝牙让风扇连接到WiFi, 这里需要检测风扇设备是否在线
   * 
   */


  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [isConnectedServer, setIsConnectedServer] = useState(false);


  useEffect(() => {
    // 创建 WebSocket 连接
    const ws = new WebSocket('ws://dontbeknow:5000/echo');

    // 连接打开事件
    ws.onopen = () => {
        console.log('WebSocket connection opened');
        // 发送消息到服务器
        ws.send('Hello from React Native');
    };

    // 连接关闭事件
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    // 接收消息事件
    ws.onmessage = (e) => {
        console.log('Message from server: ', e.data);
    };


    return () => {
      // 组件卸载时断开连接
    
      console.log('连接关闭')
    };
  }, []);




  // 打开风扇的处理逻辑
  const handleControl = async (opt) => {
    const device = route.params.device;
    // console.log('蓝牙id',device.id);
    let flag;
    try {
      flag = await RNBluetoothClassic.isDeviceConnected(device.id);
    } catch (error) {
      
    }
    console.log('asdf')
    
    if(isConnectedServer){  // 手机端是否连接到网络
      if(isDeviceOnline) { // 检查设备是否在线
        await fetch(`http://dontbeknow:5000/control?mac=A4:E5:7C:86:5A:A4&cmd=fan_on`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Data received:', data);
          // 在这里处理返回的数据
        });


      } else {
        Toast.show({
          type: 'error',
          text1: `设备未在线，请连接设备到网络`,
          position: 'top',
          visibilityTime: 2000,
        });
      }
    } else {
      if(flag) { // 蓝牙已经连接
        if(opt === 'open') {
          const cmd = {
            type: 'control',
            cmd: 'fan_on'
          };
          console.log('真服了')
          
          try {
            await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
            await RNBluetoothClassic.writeToDevice(device.id, JSON.stringify(cmd), "ascii");
            await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFE), "ascii");
          } catch (error) {
            console.log(error)
          }
          
          console.log(device.id)
          Toast.show({
            type: 'success',
            text1: `操作成功`,
            position: 'top',
            visibilityTime: 2000,
          });
        } else if(opt === 'close') {
          const cmd = {
            type: 'control',
            cmd: 'fan_off'
          };

          await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFF), "ascii");
          await RNBluetoothClassic.writeToDevice(device.id, JSON.stringify(cmd), "ascii");
          await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFE), "ascii");
          Toast.show({
            type: 'success',
            text1: `操作成功`,
            position: 'top',
            visibilityTime: 2000,
          });
          console.log('风扇关闭')

        } else if(opt === 'up') {
          const cmd = {
            type: 'control',
            cmd: 'fan_up'
          };

          await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFF), "ascii");
          await RNBluetoothClassic.writeToDevice(device.id, JSON.stringify(cmd), "ascii");
          await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFE), "ascii");


          Toast.show({
            type: 'success',
            text1: `风扇已加速`,
            position: 'bottom',
            visibilityTime: 2000,
          });
          console.log('风扇关闭')
        } else if(opt === 'down'){
          const cmd = {
            type: 'control',
            cmd: 'fan_down'
          };
          await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFF), "ascii");
          await RNBluetoothClassic.writeToDevice(device.id, JSON.stringify(cmd), "ascii");
          await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFE), "ascii");
          Toast.show({
            type: 'success',
            text1: `风扇已减速`,
            position: 'bottom',
            visibilityTime: 2000,
          });
          console.log('风扇关闭')
        }
        
      } else {
        Toast.show({
          type: 'error',
          text1: `蓝牙未连接，请连接蓝牙`,
          position: 'top',
          visibilityTime: 2000,
        });
      }
    }


  };
  
  return (
    <View>
      <View style={styles.container}>
        <TouchableHighlight style={styles.btn}

        underlayColor="#DDDDDD" // 设置高亮颜色
        onPress={() => handleControl('open')}
        >
          <Text style={styles.btnText}>开</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.btn}
          underlayColor="#DDDDDD" // 设置高亮颜色
          onPress={() => handleControl('close')}
        >
          <Text style={styles.btnText}>关</Text>
        </TouchableHighlight>
      </View>

      <View style={styles.container}>
        <TouchableHighlight style={styles.btn}
          underlayColor="#DDDDDD" // 设置高亮颜色
          onPress={() =>  handleControl('up')}
        >
          <Text style={styles.btnText}>加速</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.btn}
          underlayColor="#DDDDDD" // 设置高亮颜色
          onPress={() =>  handleControl('down')}
        >
          <Text style={styles.btnText}>减速</Text>
        </TouchableHighlight>
      </View>



    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,

    flexDirection:'row'
  },
  btn: {
    flex: 1,
    backgroundColor:'#E8E8E8',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#F0FFF0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHertical: 20,

  },

  btnText: {
    fontSize: 35
  }


})