import { Text, StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Button, Alert } from 'react-native'
import React, { Component, useState  } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginError, setIsLoginError] = useState(false);
  const handleLogin = async () => {
    try {
      const formData = new FormData(); // 创建FormData对象
      formData.append('email', email)
      formData.append('password', password)
      const response = await fetch('http://dontbeknow:5000/register', { // 替换为你的API地址
        method: 'POST',
        body: formData
      });
      const resText = await response.text();
      if(response.status == 201)
      {
        navigation.navigate('Home');
        Toast.show({
          type: 'success',
          text1: `注册成功`,
          position: 'top',
          visibilityTime: 1000,
        });
        setIsLoginError(false);
      }
      else
      {
        Toast.show({
          type: 'success',
          text1: `注册成功`,
          position: 'top',
          visibilityTime: 2000,
        });
        setIsLoginError(true);
      }
    } catch(error) {
      console.log(error)
    }
    

      
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>

      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="snow-outline" size={88} color="#36CDFC" />
          </View>
          <Text style={styles.title}>智能风扇控制系统</Text>
          <Text style={styles.subtitle}>注册你的账号以开始</Text>
      </View>


        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>
              用户名
            </Text>

            <TextInput 
              style={styles.inputControl}
              placeholder='请输入用户名'
              value={email}
              onChangeText={text => setEmail(text)}      
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
              value={password}
              onChangeText={text => setPassword(text)}
            />

          </View>
          {isLoginError&&
          (<View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={{color:'red'}}>
              注册失败，用户名已经被使用！
            </Text>
          </View>
          )}

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={handleLogin}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>
                  注册
                </Text>
              </View>
            </TouchableOpacity>

          
          </View>

     
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