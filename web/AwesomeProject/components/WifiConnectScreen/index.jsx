import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import Layout from '../WifiListLayout'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function WifiConnectScreen({route}) {
  const [devices, setDevices] = useState([]); // 存储扫描到的设备
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [currentWifi, setCurrentWifi] = useState(''); // 存储选中的WiFi名

  // 通过向蓝牙发送命令以获取wifi信息
  const handleScan = async () => {
    
    const cmd = {
      type: "wificmd",
      cmd: "scan",
    };
    await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
    await RNBluetoothClassic.writeToDevice(device.id, JSON.stringify(cmd), "ascii");
    await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFE), "ascii");
    console.log(device.id)
    const str = await RNBluetoothClassic.readFromDevice(device.id); // 获取发送过来
    const data = str.slice(1, -1);
    console.log(data);

    // const data = '{"amount":3,"wifi_point":[{"ssid":"12345"}]}';
    // console.log(data)
    const json = JSON.parse(data);
    setDevices(json['wifi_point']);



    
  };
  const handleConnect = async (ssid) => {
    const device = route.params.device;
    const cmd = {
      type: "wificmd",
      cmd: "connect",
      ssid: currentWifi,
      password: password
    };
    await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFF), "ascii"); // 使用包含指定编码字符的字符串
    await RNBluetoothClassic.writeToDevice(device.id, JSON.stringify(cmd), "ascii");
    await RNBluetoothClassic.writeToDevice(device.id, String.fromCharCode(0xFE), "ascii");
    
    console.log(device.id)
    const string = await RNBluetoothClassic.readFromDevice(device.id); // 获取
    console.log(string);


  };


  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>请输入密码:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity  style={[styles.connectBtn, {backgroundColor:'#CFCFCF',borderColor:'#CFCFCF'}]} onPress={() => setVisible(false)}>
                <Text style={{ fontSize: 18, color:'#828282'}}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={[styles.connectBtn]} onPress={() => handleConnect()}>
                  <Text style={{ fontSize: 18, color:'#fff' }}>连接</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


			<TouchableOpacity style={{ flexDirection: 'row-reverse', marginEnd: 10 }} onPress={handleScan}>
				<View style={styles.searchBtn}>
					<Text style={{ fontSize: 18 }}>刷新</Text>
				</View>

			</TouchableOpacity>

			<Layout title='Wifi设备'>
				<FlatList
					data={devices}
					ListEmptyComponent={() => (<Text style={{fontSize:10}}>未扫描到wifi</Text>)}
					keyExtractor={(item) => item.ssid}
					renderItem={({ item }) => (
						<View>
							<TouchableOpacity onPress={() => {setVisible(true); setCurrentWifi(item.ssid)}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <View>
                    <Ionicons name={'wifi-outline'} size={30} color="#000" />
                  </View>
                  <View style={{marginStart:30}}>
                    <Text style={{ fontSize: 25 }}>{item.ssid}</Text>
                  </View>

                  <View style={{flexDirection:'row', flex:1, justifyContent:'flex-end', alignItems:'center'}}>
                    <Ionicons name={'lock-closed-outline'} size={20} color="#000" />
                  </View>

                </View>
              </TouchableOpacity>
              
							<View style={{ height: 1, width: '100%', backgroundColor: '#CED0CE', marginVertical: 10 }}>
							</View>
						</View>


					)}
				/>
			</Layout>

		</View>
  


  )
}




const styles = StyleSheet.create({
	searchBtn: {
		backgroundColor: '#7bbfea',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#075eec',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: 100,
		height: 50,
		marginTop: 10,
		marginBottom: 10,
		paddingVertical: 5,
		paddingHertical: 5,
	},
  connectBtn: {
    backgroundColor: '#1E90FF',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#075eec',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: 100,
		height: 50,
		marginTop: 10,
		marginBottom: 10,
		paddingVertical: 5,
		paddingHertical: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  }


})