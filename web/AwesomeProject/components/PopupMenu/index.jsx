import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Modal,Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native';



export default function PopupMenu() {
  const [visibel, setVisible] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1700,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>

        <Ionicons name="add-outline" size={27}  />
      </TouchableOpacity>
      <Modal  transparent={true} visible={visibel}>
        <SafeAreaView   style={{flex:0, zIndex:1, }}>
          <Animated.View style={[styles.popup, {opacity: fadeAnim}]}>
            <TouchableOpacity style={{}} onPress={() => {
              setVisible(false);
              navigation.navigate('NewDevice');
            }}>
              <Text style={{fontSize:22, color:'#000', backgroundColor:'white'}}>
                添加新设备
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>

        <TouchableOpacity style={{flex:1,flexDirection:'column-reverse', backgroundColor:'rgba(0,0,0,0.3)'}} onPress={() => setVisible(false)}>
        </TouchableOpacity>


      </Modal>





    </View>
  )
}


const styles = StyleSheet.create({
  popup: {
    //height: 30,
    borderRadius: 3,

    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: 'absolute',
    top: 57,
    right: 0
  }



})