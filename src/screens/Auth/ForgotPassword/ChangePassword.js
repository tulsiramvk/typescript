import { View, Text, StatusBar, TouchableOpacity, ImageBackground } from 'react-native'
import React, {  useState } from 'react'
import bgImage from '../../../static/images/auth_background.jpg'
import styles from './Style'
import TextInputWithIcon from '../../../Components/Inputs/TextInputIcon'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../../helpers/colors'
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../helpers/Loader'
import Toast from 'react-native-toast-message'
import { useAuthenticationStore } from '../../../Store/AuthenticationStore'

const ChangePassword = ({ route }) => {
    const { params } = route
    const navigation = useNavigation()
    const { changePassword } = useAuthenticationStore()
    const [spinning, setSpinning] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const [payload, setPayload] = useState({
        password: '', confirm_password: ''
    })

    const handleChangePassword = () => {
        if (payload.password.length > 0 && payload.confirm_password.length > 0) {
            if (payload.password === payload.confirm_password) {
                setSpinning(true)
                let d = {
                    email: params.data.email, password: payload.password, confirm_password: payload.confirm_password
                }
                changePassword(d)
                    .then(res => {
                        setSpinning(false)
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: "Password changed successfully. Login to continue."
                        });
                        navigation.navigate("Login")
                    })
                    .catch(err => {
                        setSpinning(false)
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: "Something went wrong."
                        });
                    })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: "Confirm password does not matched."
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "Please enter password & confirm password."
            });
        }
    }

    return (
        <ImageBackground source={bgImage} resizeMode="cover" style={[styles.scene]}>
            <Loader spinning={spinning} />
            <StatusBar barStyle="light-content" backgroundColor="#002242" />
            <View style={{ width: '90%', margin: 'auto', marginTop: '19%' }}>

                <Text allowFontScaling={false} style={[styles.label]}>
                    Change Password
                </Text>

                <Text allowFontScaling={false} style={[styles.blue_desc]}>
                    Set your new password
                </Text>

                <View style={{ marginTop: 15 }}>
                    <View style={[styles.inputWrapper]}>
                        <Text allowFontScaling={false} style={[styles.inputLabel]}>New Password</Text>
                        <TextInputWithIcon
                            secureTextEntry={showPassword}
                            iconName="lock"
                            placeholder="Enter Your New Password"
                            value={payload.password}
                            onChangeText={(e) => setPayload({ ...payload, password: e })}
                        />
                        <View style={{ position: 'absolute', right: 0, marginTop: 47, marginRight: 15 }}>
                            <Icon onPress={() => setShowPassword(!showPassword)} name={'remove-red-eye'} size={25} color={colors.white} />
                        </View>
                    </View>

                    <View style={[styles.inputWrapper]}>
                        <Text allowFontScaling={false} style={[styles.inputLabel]}>Confirm Password</Text>
                        <TextInputWithIcon
                            secureTextEntry={showPassword2}
                            iconName="lock"
                            placeholder="Confirm Password"
                            value={payload.confirm_password}
                            onChangeText={(e) => setPayload({ ...payload, confirm_password: e })}
                        />
                        <View style={{ position: 'absolute', right: 0, marginTop: 47, marginRight: 15 }}>
                            <Icon onPress={() => setShowPassword2(!showPassword2)} name={'remove-red-eye'} size={25} color={colors.white} />
                        </View>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn_outline, { width: '35%', marginRight: 10 }]}>
                        <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleChangePassword} style={[styles.btn, { width: '35%' }]}>
                        <Text allowFontScaling={false} style={styles.btnText}>Change</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ImageBackground>
    )
}

export default ChangePassword