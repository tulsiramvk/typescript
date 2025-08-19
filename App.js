import 'react-native-gesture-handler';
import { View, Image, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import MainBackground from './src/Components/MainBackground/MainBackground';
import logo from './src/static/images/logo.png';
import { useHomeStore } from './src/Store/HomeStore/HomeStore';
import VersionInfo from 'react-native-version-info';
import fonts from './src/helpers/fonts';
import { useAuthenticationStore } from './src/Store/AuthenticationStore';
import {colors} from './src/helpers/colors';
import AuthNavigations from './src/Navigation/AuthNavigations';
import Navigation from './src/Navigation/Navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Fonts = fonts
const App = () => {
  const { userInfo, setUserInfo } = useAuthenticationStore();
  const [splashLoading, setSplashLoading] = useState(true);

  const { setIsEnabled, isEnabled } = useHomeStore();
  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      let userInfo2 = await AsyncStorage.getItem('userInfo');
      let isEnabled2 = await AsyncStorage.getItem('isEnabled');
      setIsEnabled(JSON.parse(isEnabled2) || false);
      userInfo2 = JSON.parse(userInfo2);
      if (userInfo2) {
        setUserInfo(userInfo2);
      }
      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={[(allowFontScaling = false)]}
        text2Props={[(allowFontScaling = false)]}
        style={{
          borderColor: colors.blue,
          paddingVertical: 4,
          backgroundColor: 'rgba(0, 39, 76,0.8)',
          minHeight: 50,
          marginBottom: 40,
          height: 'auto',
          borderWidth: 0.4,
        }}
        text1Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: 400,
        }}
        text2Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: 400,
        }}
      />
    ),
    info: props => (
      <BaseToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={[(allowFontScaling = false)]}
        text2Props={[(allowFontScaling = false)]}
        style={{
          borderColor: colors.blue,
          paddingVertical: 4,
          backgroundColor: 'rgba(0, 39, 76,0.8)',
          minHeight: 50,
          marginBottom: 40,
          height: 'auto',
          borderWidth: 0.4,
        }}
        text1Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: 400,
        }}
        text2Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: 400,
        }}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Props={[(allowFontScaling = false)]}
        text2Props={[(allowFontScaling = false)]}
        style={{
          borderColor: 'tomato',
          paddingVertical: 4,
          backgroundColor: 'rgba(0, 39, 76,0.8)',
          minHeight: 50,
          height: 'auto',
          marginBottom: 40,
          borderWidth: 0.4,
        }}
        text1Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: 400,
        }}
        text2Style={{
          fontSize: 13,
          fontFamily: Fonts.regular,
          color: colors.white,
          fontWeight: 400,
        }}
      />
    ),
  };
  
  if (!splashLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}} edges={['bottom','left','right']} >
          {userInfo ? <Navigation /> : <AuthNavigations />}
          <Toast position="bottom" config={toastConfig} />
          </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return (
      <>
        <MainBackground>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={logo}
              style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 10 }}
            />
            <Text allowFontScaling={false} style={[{ fontSize: 11, color: colors.white, fontFamily: Fonts.bold, textAlign: 'center' }]}>App Version : v{VersionInfo?.appVersion || '1.1'}</Text>
          </View>
        </MainBackground>
      </>
    );
  }
};

export default App;
