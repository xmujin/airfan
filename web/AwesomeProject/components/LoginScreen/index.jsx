import { Text, StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Button, Alert } from 'react-native'
import React, { Component } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'




export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>

      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="snow-outline" size={88} color="#36CDFC" />
          </View>
          <Text style={styles.title}>智能风扇控制系统</Text>
          <Text style={styles.subtitle}>登录到你的系统</Text>
      </View>


        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              用户名
            </Text>

            <TextInput 
              style={styles.inputControl}
              placeholder='请输入用户名'


                          
            />

          </View>
          <View style={styles.input}>

          
            <Text style={styles.inputLabel}>
              密码
            </Text>

            <TextInput 
              style={styles.inputControl}
              placeholder='请输入密码'
              secureTextEntry={true}
            />

          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>
                  登录
                </Text>
              </View>
            </TouchableOpacity>

          
          </View>

          <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={{marginTop:'auto'}}
            >
              <Text  style={styles.formFooter}>
                没有账号？<Text style={{textDecorationLine:'underline'}}>点击注册</Text>
              </Text>
            </TouchableOpacity>

            
        </View>

      </View>
    </SafeAreaView>




    
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 29
  },
  header: {
    marginVertical: 36,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 36
  },
  title: {
    fontSize: 30,
    fontWeight:'700',
    color:'#1e1e1e',
    marginBottom:6,
    textAlign:'center'

  },
  subtitle:{
    fontSize:15,
    fontWeight:'500',
    color:'#929292',
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 22,
    color:'#1e1e1e',
    marginBottom: 10,
    fontWeight:'500'
  },
  inputControl: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    color:'#222',
    fontWeight: '500',
    marginBottom: 10

  },
  form: {
    marginBottom: 24,
    flex: 1
  },
  btn: {
    backgroundColor:'#075eec',
    borderRadius:8,
    borderWidth:1,
    borderColor:'#075eec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
    paddingVertical: 10,
    paddingHertical: 20,


    
  },
  btnText: {
    fontSize:20,
    fontWeight: '500',
    color:'#fff'
  },
  formAction: {
    marginVertical:24
  },
  formFooter: {
    fontSize: 17,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 1
  }
  

})