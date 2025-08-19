import { View, Text, StatusBar, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useRef, useState } from 'react'
import bgImage from '../../../static/images/auth_background.jpg'
import styles from './Style'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../helpers/Loader'
import Toast from 'react-native-toast-message'
import { useAuthenticationStore } from './../../../Store/AuthenticationStore';

const VerifyEmail = ({ route }) => {
    const { params } = route
    const navigation = useNavigation()
    const { VerifyOtp, sendOtp } = useAuthenticationStore()
    const [spinning, setSpinning] = useState(false)
    const [length, setLength] = useState(6)
    const [otp, setOtp] = useState('');
    const inputs = useRef([]);
    const handleOtpChange = (newOtp) => {
        setOtp(newOtp);
    };

    const [otp2, setOtp2] = useState(new Array(length).fill(''));

    const handleChange = (text, index) => {
        const newOtp = [...otp2];
        newOtp[index] = text;
        setOtp2(newOtp);
        handleOtpChange(newOtp.join(''));

        // Move focus to the next input field
        if (text && index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index]) {
            if (index > 0) {
                const newOtp = [...otp2];
                newOtp[index - 1] = '';
                setOtp2(newOtp);
                inputs.current[index - 1].focus();
                handleOtpChange(newOtp.join(''));
            }
        }
    };

    const handleResend = () => {
        setSpinning(true)
        sendOtp({ email: params.data.email })
            .then(res => {
                setSpinning(false)
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: "OTP resend successfully."
                });
            })
            .catch(err => {
                setSpinning(false)
            })
    }

    const verifyOtp = () => {
        if (otp.length === 6) {
            setSpinning(true)
            d = {
                email: params.data.email, otp: otp
            }
            VerifyOtp(d)
                .then(res => {
                    setSpinning(false)
                    if (res.data.status === 'Error') {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: "Invalid OTP. Please try again."
                        });
                    } else {
                        navigation.navigate('ChangePassword', { data: d })
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: "Set new password."
                        });
                    }
                })
                .catch(err => {
                    setSpinning(false)
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: "Wrong OTP."
                    });
                })
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "Enter six digit OTP."
            });
        }

    }

    return (
        <ImageBackground source={bgImage} resizeMode="cover" style={[styles.scene]}>
            <Loader spinning={spinning} />
            <StatusBar barStyle="light-content" backgroundColor="#002242" />
            <View style={{ width: '90%', margin: 'auto', marginTop: '19%' }}>

                <Text allowFontScaling={false} style={[styles.label, { marginBottom: 10 }]}>
                    Verify Email
                </Text>

                <Text allowFontScaling={false} style={[styles.blue_desc]}>
                    Please enter six digit code just sent to J*******e@gmail.com
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 }}>
                    {otp2.map((digit, index) => (
                        <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={["#0C213C", "#083B79"]} style={[styles.container, { borderRadius: 8 }]} >
                            <TextInput
                                key={index}
                                style={[styles.input]}
                                keyboardType="numeric"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                ref={(ref) => (inputs.current[index] = ref)}
                            />
                        </LinearGradient>
                    ))}
                </View>


                <Text allowFontScaling={false} onPress={handleResend} style={[styles.blue_desc, { textAlign: 'left' }]}>
                    Resend
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn_outline, { width: '35%', marginRight: 10 }]}>
                        <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={verifyOtp} style={[styles.btn, { width: '35%' }]}>
                        <Text allowFontScaling={false} style={styles.btnText}>Continue</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ImageBackground>
    )
}

export default VerifyEmail