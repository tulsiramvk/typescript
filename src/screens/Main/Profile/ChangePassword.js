import MainBackground from '../../../Components/MainBackground/MainBackground'
import Title from '../../../Components/Title/Title'
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../../helpers/colors'
import { useNavigation } from '@react-navigation/native'
import styles from './Style'
import InputIcon from '../../../Components/Inputs/InputIcon'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message'
import Loader from '../../../helpers/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthenticationStore } from '../../../Store/AuthenticationStore'
import { useProfileStore } from './../../../Store/ProfileStore/ProfileStore';

const ChangePassword = () => {
    const {setUserInfo} = useAuthenticationStore()
    const navigation = useNavigation()
    const [hide1, setHide1] = useState(true)
    const [hide2, setHide2] = useState(true)
    const [hide3, setHide3] = useState(true)
    const [spinning, setSpinning] = useState(false)
    const { changePassword } = useProfileStore()
    const [payload, setPayload] = useState({
        current_password: '', new_password: '', confirm_password: ''
    })

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userInfo');
        setUserInfo(null)
      }

    const handleChangePassword = () => {
        if (payload.current_password.length > 0 && payload.confirm_password.length > 0 && payload.new_password.length > 0) {
            if (payload.new_password === payload.confirm_password) {
                setSpinning(true)
                changePassword(payload)
                    .then(res => {
                        setSpinning(false)
                        if (res.data.status === 'success') {
                            Toast.show({
                                type: 'success',
                                text1: "Password changed successfully."
                            });
                            handleLogout()
                            setPayload({ ...payload, current_password: '', new_password: '', confirm_password: '' })
                        } else {
                            Toast.show({
                                type: 'error',
                                text2: res.data.message,
                            });
                        }
                    })
                    .catch(err => {
                        setSpinning(false)
                        Toast.show({
                            type: 'error',
                            text2: err.response ? err.response.data ? err.response.data.message:'Error':'Error',
                        });
                    })
            } else {
                Toast.show({
                    type: 'error',
                    text1: "Confirm password does not matched."
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: "All fields required."
            });
        }
    }

    return (
        <MainBackground>
            <Loader spinning={spinning} />
            <View style={[styles.block]}>
                <Title name="Change Password" />
            </View>

            <View style={[styles.block, { marginTop: 25 }]}>
                <View style={[styles.card]}>

                    <View style={{ padding: 10, marginTop: 10 }}>

                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Old Pasword</Text>
                            <InputIcon
                                secureTextEntry={hide1}
                                iconName="form-textbox-password"
                                placeholder="Enter Old Pasword"
                                value={payload.current_password}
                                onChangeText={(e) => setPayload({ ...payload, current_password: e })}
                            />
                            <View style={{ position: 'absolute', right: 0, marginTop: 38, marginRight: 15 }}>
                                <Icon onPress={() => setHide1(!hide1)} name={'remove-red-eye'} size={20} color={colors.white} />
                            </View>
                        </View>
                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>New Password</Text>
                            <InputIcon
                                secureTextEntry={hide2}
                                iconName="form-textbox-password"
                                placeholder="Enter Your New Password"
                                value={payload.new_password}
                                onChangeText={(e) => setPayload({ ...payload, new_password: e })}
                            />
                            <View style={{ position: 'absolute', right: 0, marginTop: 38, marginRight: 15 }}>
                                <Icon onPress={() => setHide2(!hide2)} name={'remove-red-eye'} size={20} color={colors.white} />
                            </View>
                        </View>
                        <View style={[styles.inputWrapper]}>
                            <Text allowFontScaling={false} style={[styles.inputLabel]}>Confirm Password</Text>
                            <InputIcon
                                secureTextEntry={hide3}
                                iconName="form-textbox-password"
                                placeholder="Confirm Password"
                                value={payload.confirm_password}
                                onChangeText={(e) => setPayload({ ...payload, confirm_password: e })}
                            />
                            <View style={{ position: 'absolute', right: 0, marginTop: 38, marginRight: 15 }}>
                                <Icon onPress={() => setHide3(!hide3)} name={'remove-red-eye'} size={20} color={colors.white} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn_outline2, { width: '35%', marginRight: 10 }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleChangePassword} style={[styles.btn2, { width: '35%' }]}>
                                <Text allowFontScaling={false} style={styles.btnText}>Change</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </View>


        </MainBackground>
    )
}

export default ChangePassword