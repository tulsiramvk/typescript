import { View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React from 'react'
import bgImage from '../../../static/images/auth_background.jpg'
import logo from '../../../static/images/logo.png'
import styles from './Style'
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation()
  return (
    <ImageBackground source={bgImage} resizeMode="cover" style={[styles.scene]}>
      
      <View style={styles.block}>
        <Image
          source={logo}
          resizeMode={'contain'}
          style={{
            width: 200,
            height: 200,
          }}
        />
      </View>

      <View style={[styles.block]}>
        <View style={{ width: '90%', margin: 'auto' }}>
          <Text allowFontScaling={false} style={[styles.blue_desc]}>
            Welcome to
          </Text>
          <Text allowFontScaling={false} style={[styles.label,{fontSize:34}]}>
            Fortune Pick 3 & Pick 4
          </Text>
          <Text allowFontScaling={false} style={[styles.blue_desc,{fontSize:15,lineHeight:27,marginTop:5}]}>
          Your chance to win big starts here. Log in to play and discover your fortune today."
          </Text>

          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
            <Text allowFontScaling={false} style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Welcome