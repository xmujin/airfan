import { View, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid, Platform, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';
import Layout from '../BluetoothListLayout'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';

// 添加新设备   




export default function NewDeviceScreen() {
	const [devices, setDevices] = useState([]); // 存储扫描到的设备
	const [connectedDevice, setConnectedDevice] = useState(null);
	const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
	const [favorites, setFavorites] = useState([]);


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


		const sb = RNBluetoothClassic.onDeviceDiscovered(deviceDiscoveredListener);

		init();
		loadFavorites();

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
				position: 'top',
				visibilityTime: 2000,
			});
			setDevices([]);
			const unpairedDevices = await RNBluetoothClassic.startDiscovery();      //setDevices(unpairedDevices);
			setDevices(unpairedDevices);
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



	const addFavorite = async (item) => {

		const isExist = favorites.some(favorite => favorite.id === item.id);
		if (!isExist) {
			const fav = { id: item.id, name: item.name, isConnected: false};
			setFavorites([...favorites, fav]);

			const jsonValue = JSON.stringify([...favorites, fav]);
			await AsyncStorage.setItem('favorites', jsonValue);
		}
		else // 取消收藏
		{
			const updatedFavorites = favorites.filter(favorite => favorite.id !== item.id);
			setFavorites(updatedFavorites);
			const jsonValue = JSON.stringify(updatedFavorites);
			await AsyncStorage.setItem('favorites', jsonValue);

		}

	};

	const [isStarred, setIsStarred] = useState(false);
	return (
		<View style={{ flex: 1 }}>


			<TouchableOpacity style={{ flexDirection: 'row-reverse', marginEnd: 10 }} onPress={discoverDevices}>
				<View style={styles.searchBtn}>
					<Text style={{ fontSize: 18 }}>开始扫描</Text>
				</View>

			</TouchableOpacity>

			<Layout title='蓝牙设备'>
				<FlatList
					data={devices}
					// ListEmptyComponent={() => {<Text style={{fontSize:10}}>未扫描到蓝牙设备，请打开蓝牙和定位</Text>}}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (


						<View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
								<View>
									<Text style={{ fontSize: 25 }}>{item.name === item.id ? '未命名设备' : item.name}</Text>
									<Text>Mac地址: {item.id}</Text>
								</View>
								<TouchableOpacity onPress={() => addFavorite(item)}>
									<Ionicons name={favorites.some(favorite => favorite.id === item.id) ? 'star' : 'star-outline'} size={30} color="#36CDFC" />
								</TouchableOpacity>
							</View>


							<View style={{ height: 1, width: '100%', backgroundColor: '#CED0CE', marginVertical: 10 }}>
							</View>
						</View>


					)}
				/>
			</Layout>


			{connectedDevice && (
				<TouchableOpacity onPress={() => sendData('Hello, Bluetooth!')}>
					<Text>Send Data</Text>
				</TouchableOpacity>
			)}
		</View>
	);
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

	}


})