import { View,Modal, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNBluetoothClassic, {BluetoothDevice} from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'


export default function HomeScreen() {
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();
  const [connectedDevice, setConnectedDevice] = useState(null); // 已连接的设备
  const [selectedValue, setSelectedValue] = useState("java");
  const [modalVisible, setModalVisible] = useState(false); // 底部弹出菜单
  const [currentIndex, setCurrentIndex] = useState(); // 已连接的设备 

  useEffect(() =>{
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('favorites'); // 加载已经收藏的蓝牙设备
        if (jsonValue != null) {
          setFavorites(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Failed to load stored devices', e);
      }

    }
    if (isFocused) {
      loadFavorites();
    }

  }, [isFocused]);

  const connectDevice = async (item) => {
   
    try {
			const connected = await RNBluetoothClassic.pairDevice(item.id);
      setConnectedDevice(connected);
      setFavorites(favorites.map(favorite =>
        favorite.id === item.id ? { name:favorite.name, id: favorite.id, isConnected: true } : favorite
      ));
			
		} catch (e) {
			console.error(e);
		}
  }

  const cancelFavorite = async () => {
    const updatedFavorites = favorites.filter(favorite => favorite.id !== currentIndex);
    setFavorites(updatedFavorites);
    const jsonValue = JSON.stringify(updatedFavorites);
    await AsyncStorage.setItem('favorites', jsonValue);

  }


  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical:10}}>
      

      <FlatList
          data={favorites}
          ListEmptyComponent={() => (<View>
            <Text>
            还未添加新设备，请点击右上角按钮添加
          </Text>
          </View>)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <View>
                  <Text style={{fontSize:25}}>{item.name === item.id? '未命名设备' : item.name}</Text>
                  <Text>Mac地址: {item.id}</Text>
                  <Text>状态: {item.isConnected? <Text style={{color:'green'}}>{'已连接'}</Text> : <Text style={{color:'red'}}>{'未连接'}</Text>}</Text>
                  </View>
                
                  <View>
                    <TouchableOpacity onPress={() => {
                      setModalVisible(true);
                      setCurrentIndex(item.id);
                      

                    }


                    }>
                      <Ionicons name={'menu-outline'} size={30} color="#000" />
                    </TouchableOpacity>   
                    <TouchableOpacity style={{backgroundColor:'#426ab3', borderWidth:1, borderRadius:5, padding:3, borderColor:'#426ab3'}} onPress={() => connectDevice(item)}>
                      <Text style={{color:'white'}}>连接</Text>
                    </TouchableOpacity>   
                    <View/>
                  </View>
              </View>


              <View style={{height: 1,width: '100%',backgroundColor: '#CED0CE',marginVertical: 10}}>
              </View>


            </View>
          )
      }/>

<Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={{flex:1, backgroundColor:'rgba(0,0,0,0.3)'}} onPress={() => setModalVisible(false)}> 
        </TouchableOpacity>

    
        <View style={[styles.pickerContainer]}>
          <Text style={styles.title}>请选择操作:</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.pickerText}>风扇控制</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.pickerText}>灯光控制</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.pickerText}>wifi连接</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => {
              cancelFavorite();
              setModalVisible(false);
            }
            }
          >
            <Text style={styles.pickerText}>取消收藏</Text>
          </TouchableOpacity>
        </View>
      </Modal>


   
      







        

      
      
    </View>
  );
}


const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: 'white',
    padding: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  pickerButton: {
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius: 5,
  },
  pickerText: {
    color: 'black',
    fontSize: 22,
  },
});