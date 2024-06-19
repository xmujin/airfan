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
    //console.log(route)
    console.log('蓝牙id',device.id);
    const flag = await RNBluetoothClassic.isDeviceConnected(device.id);

    if(isConnectedServer){ 
      if(isDeviceOnline) {
        
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
        console.log('蓝牙已经连接');
        // 49开  50关
        if(opt === 'open') {
          RNBluetoothClassic.writeToDevice(device.id, "1", "ascii");
          console.log(device.id)
          Toast.show({
            type: 'success',
            text1: `操作成功`,
            position: 'top',
            visibilityTime: 2000,
          });
        } else if(opt === 'close') {
          RNBluetoothClassic.writeToDevice(device.id, "2", "ascii");
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
    socket.emit('message', '2342', (val) => {
      console.log(val)
  });
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
          onPress={() => console.log('Button pressed')}
        >
          <Text style={styles.btnText}>加速</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.btn}
          underlayColor="#DDDDDD" // 设置高亮颜色
          onPress={() => console.log('Button pressed')}
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