import { View, Text, StatusBar, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import bgImage from '../../../static/images/auth_background.jpg'
import styles from './Style'
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../../helpers/fonts'
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../helpers/Loader'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {colors} from './../../../helpers/colors';
import { useAuthenticationStore } from './../../../Store/AuthenticationStore';

const Login = () => {
  const navigation = useNavigation()
  const { loginUser, setUserInfo } = useAuthenticationStore()
  const [spinning, setSpinning] = useState(false)
  const [payload, setPayload] = useState({
    email: '', password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const storeData = async (data) => {
    data = JSON.stringify(data)
    await AsyncStorage.setItem('userInfo', data)
    return true
  }

  const handleLogin = () => {
    setSpinning(true)
    loginUser(payload)
      .then(res => {
        setSpinning(false)
        if (res.data.status === 'success') {
          storeData(res.data.data)
          setUserInfo(res.data.data)
          Toast.show({
            type: 'success',
            text1: 'Login success.'
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Email or password is incorrect.'
          });
        }
      })
      .catch(err => {
        setSpinning(false)
        if (err.response) {
          Toast.show({
            type: 'error',
            text1: err.response.data.message
          });
        } else {
          Toast.show({
            type: 'error',
            text1: "Email or password is incorrect."
          });
        }

      })
  }

  return (
    <ImageBackground source={bgImage} resizeMode="cover" style={[styles.scene]}>
      <Loader spinning={spinning} />
      <View style={{ backgroundColor: 'rgba(0,0,0,0.0)', flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#002242" />
        <View style={{ width: '90%', margin: 'auto', marginTop: '19%' }}>

          <Text allowFontScaling={false} style={[styles.label, { marginBottom: 30 }]}>
            Log In
          </Text>

          <View style={[styles.inputWrapper]}>
            <Text allowFontScaling={false} style={[styles.inputLabel]}>Email</Text>
            <TextInputWithIcon
              iconName="mail"
              placeholder="example@gmail.com"
              value={payload.email}
              onChangeText={(value) => setPayload({ ...payload, email: value })}
            />
          </View>
          <View style={[styles.inputWrapper]}>
            <Text allowFontScaling={false} style={[styles.inputLabel]}>Password</Text>
            <TextInputWithIcon
              secureTextEntry={!showPassword}
              iconName="lock"
              placeholder="Enter your password"
              value={payload.password}
              onChangeText={(value) => setPayload({ ...payload, password: value })}
            />
            <View style={{ position: 'absolute', right: 0, marginTop: 47, marginRight: 15 }}>
              <Icon onPress={() => setShowPassword(!showPassword)} name={!showPassword ? "eye" : "eye-off"} size={25} color={colors.white} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={[{ marginVertical: 6 }]} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text allowFontScaling={false} style={{ color: colors.white, fontFamily: fonts.regular, textAlign: 'right', fontSize: 14 }}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text allowFontScaling={false} style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>

        </View>


      </View>
    </ImageBackground>
  )
}

export default Login