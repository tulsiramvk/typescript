import { View, Text, StatusBar, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import bgImage from '../../../static/images/auth_background.jpg'
import styles from './Style'
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon'
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import Loader from '../../../helpers/Loader'
import { useAuthenticationStore } from './../../../Store/AuthenticationStore';

const ForgotPassword = () => {
    const {sendOtp} = useAuthenticationStore()
    const navigation = useNavigation()
    const [spinning, setSpinning] = useState(false)
    const [email, setEmail] = useState('')
    const handleNext = ()=>{
        if(email.length>0){
            setSpinning(true)
            sendOtp({email})
            .then(res=>{
                setSpinning(false)
                navigation.navigate('VerifyEmail',{data:res.data.data})
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: "OTP sent successfully."
                  });
            })
            .catch(err=>{
                setSpinning(false)
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: "Email not found."
                  });
            })
        }else{
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "Email required."
              });
        }
    }
    return (
        <ImageBackground source={bgImage} resizeMode="cover" style={[styles.scene]}>
            <Loader spinning={spinning} />
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#002242" />
                <View style={{ width: '90%', margin: 'auto', marginTop: '19%' }}>

                    <Text allowFontScaling={false} style={[styles.label, { marginBottom: 10 }]}>
                        Forgot Password
                    </Text>

                    <View style={[styles.inputWrapper]}>
                        <Text allowFontScaling={false} style={[styles.inputLabel]}>Email</Text>
                        <TextInputWithIcon
                            iconName="mail"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                        />
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn_outline,{width:'35%',marginRight:10}]}>
                            <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} style={[styles.btn,{width:'35%'}]}>
                            <Text allowFontScaling={false} style={styles.btnText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </View>
        </ImageBackground>
    )
}

export default ForgotPassword