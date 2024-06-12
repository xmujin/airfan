import { View, Text, TouchableHighlight, TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'

export default function FanControlScreen() {
  return (
    <View>
      <View style={styles.container}>
        <TouchableHighlight style={styles.btn}

        underlayColor="#DDDDDD" // 设置高亮颜色
        onPress={() => console.log('Button pressed')}
        >
          <Text style={styles.btnText}>开</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.btn}
          underlayColor="#DDDDDD" // 设置高亮颜色
          onPress={() => console.log('Button pressed')}
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