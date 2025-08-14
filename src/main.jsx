import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Login from './screens/Auth/Login';
import Navigation from './Navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { authStore } from './Store/AuthStore/auth';
import { getData, Logout } from './Store/Storage';
import logo from './static/images/logo.jpg';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Main = () => {
  const { userInfo, setUserInfo, setCurrentLang,currentLang } = authStore()
  const [isLoading, setIsLoading] = useState(true)
  const { t, i18n } = useTranslation();
  const checkLogin = async () => {
    const u = await getData()
    if (u) {
      setUserInfo(u)
    }
  }

  const checkLang = async () => {
    const u = await AsyncStorage.getItem('Lang')
    if (u) {
      setCurrentLang(u)
      i18n.changeLanguage(u==="English"?'en':'hi');
    }
  }

  const fetchAll = async()=>{
    await checkLogin()
    await checkLang()
    setIsLoading(false)
  }

  useEffect(() => {
    i18n.changeLanguage(currentLang==="English"?'en':'hi');
  }, [currentLang])
  

  useEffect(() => {
    fetchAll()
  }, [])

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Image source={logo} resizeMode='contain' style={{ width: 200, height: 200 }} />
    </View>
  } else {
    return (
      !userInfo ?
        <Login />
        :
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>

    )
  }
}

export default Main;
