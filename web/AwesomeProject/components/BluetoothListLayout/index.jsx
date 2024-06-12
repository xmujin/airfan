import { View, Text, StyleSheet } from 'react-native'
import React from 'react'


// 蓝牙列表的布局
export default function BluetoothListLayout(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal:20,
      paddingVertical: 20,
      backgroundColor:'#fff'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    }

})